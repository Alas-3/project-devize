'use client'

import { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { mockUsers, User } from '../../data/mockData';

interface NewProjectPanelProps {
  onClose: () => void;
  onSubmit: (project: {
    name: string;
    description: string;
    members: string[];
    labels: string[];
  }) => void;
  currentUserId: string;
}

export function NewProjectPanel({ onClose, onSubmit, currentUserId }: NewProjectPanelProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentUserId]);
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');

  const handleToggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        members: selectedMembers,
        labels,
      });
      onClose();
    }
  };

  const currentUser = mockUsers.find((u) => u.id === currentUserId);
  const isPM = currentUser?.role === 'pm';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl">New Project</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="project-description">Description *</Label>
              <Textarea
                id="project-description"
                placeholder="Describe the project goals and scope"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Team Members */}
            <div className="space-y-3">
              <Label>Team Members</Label>
              <div className="border rounded-lg p-3 max-h-64 overflow-auto space-y-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleToggleMember(user.id)}
                  >
                    <Checkbox
                      checked={selectedMembers.includes(user.id)}
                      onCheckedChange={() => handleToggleMember(user.id)}
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </p>
            </div>

            {/* Labels (PM only) */}
            {isPM && (
              <div className="space-y-3">
                <Label>Project Labels</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLabel();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddLabel}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {labels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {labels.map((label) => (
                      <Badge key={label} variant="secondary" className="gap-1">
                        <Tag className="w-3 h-3" />
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemoveLabel(label)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !description.trim()}>
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
