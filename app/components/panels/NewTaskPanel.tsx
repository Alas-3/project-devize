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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { mockUsers, mockProjects, TaskPriority, TaskStatus } from '../../data/mockData';

interface NewTaskPanelProps {
  onClose: () => void;
  onSubmit?: (task: {
    title: string;
    description: string;
    project_id: string;
    assignees: string[];
    priority: TaskPriority;
    status: TaskStatus;
    labels: string[];
    due_date?: string;
  }) => void;
  currentUserId?: string;
  projectId?: string;
}

export function NewTaskPanel({
  onClose,
  onSubmit,
  currentUserId,
  projectId: defaultProjectId,
}: NewTaskPanelProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [dueDate, setDueDate] = useState('');

  const currentUser = currentUserId ? mockUsers.find((u) => u.id === currentUserId) : mockUsers[0];
  const isPM = currentUser?.role === 'pm';

  // Get available team members from selected project
  const selectedProject = mockProjects.find((p) => p.id === projectId);
  const availableMembers = selectedProject
    ? mockUsers.filter((u) => selectedProject.members.includes(u.id))
    : [];

  const handleToggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
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
    if (title.trim() && description.trim() && projectId) {
      onSubmit?.({
        title: title.trim(),
        description: description.trim(),
        project_id: projectId,
        assignees: selectedAssignees,
        priority,
        status,
        labels,
        due_date: dueDate || undefined,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl">New Task</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title *</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="task-description">Description *</Label>
              <Textarea
                id="task-description"
                placeholder="Describe the task requirements"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="task-project">Project *</Label>
              <Select value={projectId} onValueChange={setProjectId} required>
                <SelectTrigger id="task-project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects
                    .filter((p) => p.members.includes(currentUserId || ''))
                    .map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(val) => setPriority(val as TaskPriority)}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
                  <SelectTrigger id="task-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Assignees */}
            {projectId && (
              <div className="space-y-3">
                <Label>Assignees</Label>
                <div className="border rounded-lg p-3 max-h-48 overflow-auto space-y-2">
                  {availableMembers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleAssignee(user.id)}
                    >
                      <Checkbox
                        checked={selectedAssignees.includes(user.id)}
                        onCheckedChange={() => handleToggleAssignee(user.id)}
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
                  {selectedAssignees.length} assignee{selectedAssignees.length !== 1 ? 's' : ''}{' '}
                  selected
                </p>
              </div>
            )}

            {/* Labels */}
            <div className="space-y-3">
              <Label>Task Labels</Label>
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
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !description.trim() || !projectId}>
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}