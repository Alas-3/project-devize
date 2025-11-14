'use client'

import { useState } from 'react';
import { X, Plus, Trash2, Check, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { mockUsers, mockRepoRequests, getProjectById, getUserById } from '../../data/mockData';

interface ProjectSettingsPanelProps {
  projectId: string;
  onClose: () => void;
}

export function ProjectSettingsPanel({ projectId, onClose }: ProjectSettingsPanelProps) {
  const project = getProjectById(projectId);
  if (!project) return null;

  const currentUser = mockUsers[0]; // In a real app, get from context
  const isPM = currentUser?.role === 'pm';
  const isOwner = project.owner_id === currentUser.id;

  const [repoUrls, setRepoUrls] = useState<string[]>(project.repo_links || []);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [pendingRepoUrl, setPendingRepoUrl] = useState('');
  const [projectLabels, setProjectLabels] = useState<string[]>(project.labels || []);
  const [newLabel, setNewLabel] = useState('');

  const pendingRequests = mockRepoRequests.filter(
    (req) => req.project_id === project.id && req.status === 'pending'
  );

  const handleAddRepo = () => {
    if (newRepoUrl.trim() && !repoUrls.includes(newRepoUrl.trim())) {
      if (isPM || isOwner) {
        const updated = [...repoUrls, newRepoUrl.trim()];
        setRepoUrls(updated);
        project.repo_links = updated;
        setNewRepoUrl('');
      }
    }
  };

  const handleRequestRepo = () => {
    if (pendingRepoUrl.trim()) {
      // In a real app, this would create a repo request
      alert(`Repository request sent to project manager: ${pendingRepoUrl}`);
      setPendingRepoUrl('');
    }
  };

  const handleRemoveRepo = (url: string) => {
    if (isPM || isOwner) {
      const updated = repoUrls.filter((r) => r !== url);
      setRepoUrls(updated);
      project.repo_links = updated;
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !projectLabels.includes(newLabel.trim())) {
      if (isPM || isOwner) {
        const updated = [...projectLabels, newLabel.trim()];
        setProjectLabels(updated);
        project.labels = updated;
        setNewLabel('');
      }
    }
  };

  const handleRemoveLabel = (label: string) => {
    if (isPM || isOwner) {
      const updated = projectLabels.filter((l) => l !== label);
      setProjectLabels(updated);
      project.labels = updated;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl">Project Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">{project.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Repository URLs */}
          <div className="space-y-3">
            <div>
              <Label>Repository URLs</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {isPM || isOwner
                  ? 'Manage repository links for this project'
                  : 'Request new repositories to be added'}
              </p>
            </div>

            {/* Existing Repos */}
            {repoUrls.length > 0 && (
              <div className="space-y-2">
                {repoUrls.map((url) => (
                  <div
                    key={url}
                    className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="flex-1 text-sm font-mono truncate">{url}</div>
                    {(isPM || isOwner) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveRepo(url)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Repo (PM/Owner) */}
            {(isPM || isOwner) && (
              <div className="flex gap-2">
                <Input
                  placeholder="https://github.com/org/repo"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRepo();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddRepo}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            )}

            {/* Request Repo (Developer) */}
            {!isPM && !isOwner && (
              <div className="flex gap-2">
                <Input
                  placeholder="Request repository URL"
                  value={pendingRepoUrl}
                  onChange={(e) => setPendingRepoUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleRequestRepo();
                    }
                  }}
                />
                <Button type="button" onClick={handleRequestRepo} variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Request
                </Button>
              </div>
            )}
          </div>

          {/* Pending Requests (PM only) */}
          {(isPM || isOwner) && pendingRequests.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div>
                  <Label>Pending Repository Requests</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Review and approve repository additions
                  </p>
                </div>

                <div className="space-y-2">
                  {pendingRequests.map((request) => {
                    const requester = mockUsers.find((u) => u.id === request.requested_by);
                    return (
                      <div
                        key={request.id}
                        className="flex items-start gap-3 p-3 border rounded-lg bg-yellow-50 border-yellow-200"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-mono mb-1">{request.repo_url}</div>
                          <div className="text-xs text-muted-foreground">
                            Requested by {requester?.name}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => {
                              request.status = 'approved';
                              setRepoUrls([...repoUrls, request.repo_url]);
                              alert('Repository approved!');
                            }}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              request.status = 'rejected';
                              alert('Repository request rejected!');
                            }}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Project Labels (PM only) */}
          {(isPM || isOwner) && (
            <div className="space-y-3">
              <div>
                <Label>Project Labels</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Organize and categorize your project
                </p>
              </div>

              {projectLabels && projectLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {projectLabels.map((label) => (
                    <Badge key={label} variant="secondary" className="gap-1 pr-1">
                      {label}
                      <button
                        type="button"
                        onClick={() => handleRemoveLabel(label)}
                        className="ml-1 hover:text-destructive rounded-full p-0.5 hover:bg-destructive/10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Add new label"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLabel();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddLabel}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Edit labels when creating or editing the project
              </p>
            </div>
          )}

          <Separator />

          {/* Project Info */}
          <div className="space-y-3">
            <Label>Project Information</Label>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owner:</span>
                <span>{mockUsers.find((u) => u.id === project.owner_id)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Members:</span>
                <span>{project.members.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex items-center justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}