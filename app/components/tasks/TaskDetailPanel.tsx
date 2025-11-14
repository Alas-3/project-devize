'use client'

import { useState } from 'react';
import { X, Calendar, User, Tag, AlertCircle, GitCommit, MessageSquare, Settings, Plus, Edit2, Save, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Task,
  getTaskById,
  getUserById,
  getCommitsByTask,
  getCommentsByTask,
  getFilesByTask,
  canUserViewFile,
  TaskStatus,
  TaskPriority,
  mockUsers,
  mockProjects,
  getProjectById,
} from '../../data/mockData';
import { CommentThread } from '../comments/CommentThread';
import { CommitList } from '../commits/CommitList';
import { TaskFilesSection } from './TaskFilesSection';

interface TaskDetailPanelProps {
  taskId: string | null;
  onClose: () => void;
  currentUserId: string;
}

export function TaskDetailPanel({ taskId, onClose, currentUserId }: TaskDetailPanelProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState<TaskStatus>('todo');
  const [editedPriority, setEditedPriority] = useState<TaskPriority>('medium');
  const [editedAssignees, setEditedAssignees] = useState<string[]>([]);
  const [editedLabels, setEditedLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');

  if (!taskId) return null;

  const task = getTaskById(taskId);
  if (!task) return null;

  const commits = getCommitsByTask(taskId);
  const comments = getCommentsByTask(taskId);
  const currentUser = getUserById(currentUserId);
  const isPM = currentUser?.role === 'pm';

  // Get project members for assignee selection
  const project = getProjectById(task.project_id);
  const availableMembers = project 
    ? mockUsers.filter((u) => project.members.includes(u.id))
    : [];

  const handleEditClick = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedStatus(task.status);
    setEditedPriority(task.priority);
    setEditedAssignees([...task.assignees]);
    setEditedLabels([...task.labels]);
    setEditedDueDate(task.due_date || '');
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    console.log('Saving task edits:', {
      title: editedTitle,
      description: editedDescription,
      status: editedStatus,
      priority: editedPriority,
      assignees: editedAssignees,
      labels: editedLabels,
      due_date: editedDueDate,
    });
    // In a real app, this would update the task
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleToggleAssignee = (userId: string) => {
    setEditedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !editedLabels.includes(newLabel.trim())) {
      setEditedLabels([...editedLabels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    setEditedLabels(editedLabels.filter((l) => l !== label));
  };

  const handleStatusChange = (newStatus: string) => {
    if (isEditMode) {
      setEditedStatus(newStatus as TaskStatus);
    } else {
      console.log('Change status to:', newStatus);
    }
  };

  const handlePriorityChange = (newPriority: string) => {
    if (isEditMode) {
      setEditedPriority(newPriority as TaskPriority);
    } else {
      console.log('Change priority to:', newPriority);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      done: 'bg-green-100 text-green-700',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority];
  };

  const displayStatus = isEditMode ? editedStatus : task.status;
  const displayPriority = isEditMode ? editedPriority : task.priority;
  const displayTitle = isEditMode ? editedTitle : task.title;
  const displayDescription = isEditMode ? editedDescription : task.description;
  const displayAssignees = isEditMode ? editedAssignees : task.assignees;
  const displayLabels = isEditMode ? editedLabels : task.labels;
  const displayDueDate = isEditMode ? editedDueDate : task.due_date;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-11/12 md:w-2/3 lg:w-1/2 bg-white border-l shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-xs sm:text-sm text-muted-foreground">{task.id}</span>
          <Badge className={getStatusColor(displayStatus)}>{displayStatus}</Badge>
          {isEditMode && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Edit2 className="w-3 h-3 mr-1" />
              Editing
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {isPM && !isEditMode && (
            <Button variant="outline" size="sm" onClick={handleEditClick} className="hidden sm:flex">
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {isPM && !isEditMode && (
            <Button variant="outline" size="icon" onClick={handleEditClick} className="sm:hidden w-8 h-8">
              <Settings className="w-4 h-4" />
            </Button>
          )}
          {isEditMode && (
            <>
              <Button variant="outline" size="sm" onClick={handleCancelEdit} className="text-xs sm:text-sm">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit} className="text-xs sm:text-sm">
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            {isEditMode ? (
              <>
                <label className="text-sm text-muted-foreground">Task Title</label>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-xl"
                  placeholder="Enter task title"
                />
              </>
            ) : (
              <h2>{displayTitle}</h2>
            )}
          </div>

          {/* Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Status
              </label>
              <Select value={displayStatus} onValueChange={handleStatusChange} disabled={!isEditMode}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Priority
              </label>
              <Select value={displayPriority} onValueChange={handlePriorityChange} disabled={!isEditMode}>
                <SelectTrigger>
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

            {/* Due Date */}
            <div className="space-y-2 col-span-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </label>
              {isEditMode ? (
                <Input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                />
              ) : displayDueDate ? (
                <div className="text-sm">
                  {new Date(displayDueDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No due date</div>
              )}
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Assignees
            </label>
            {isEditMode ? (
              <div className="border rounded-lg p-3 max-h-48 overflow-auto space-y-2">
                {availableMembers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleToggleAssignee(user.id)}
                  >
                    <Checkbox
                      checked={editedAssignees.includes(user.id)}
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
                      <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {displayAssignees.map((assigneeId) => {
                  const user = getUserById(assigneeId);
                  return (
                    <div key={assigneeId} className="flex items-center gap-2 p-2 border rounded-lg">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {user?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user?.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Labels */}
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Labels
            </label>
            {isEditMode ? (
              <>
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
                {displayLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {displayLabels.map((label) => (
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
              </>
            ) : displayLabels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayLabels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No labels</div>
            )}
          </div>

          {/* Blocked by */}
          {task.blocked_by && task.blocked_by.length > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Blocked by:</span>
                {task.blocked_by.map((blockerId) => (
                  <Badge key={blockerId} variant="outline" className="text-orange-700">
                    {blockerId}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Description</label>
            {isEditMode ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={5}
                placeholder="Enter task description"
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{displayDescription}</p>
            )}
          </div>

          <Separator />

          {/* Tabs for Commits, Discussion, and Files */}
          {!isEditMode && (
            <Tabs defaultValue="discussion" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discussion" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Discussion ({comments.length})
                </TabsTrigger>
                <TabsTrigger value="commits" className="gap-2">
                  <GitCommit className="w-4 h-4" />
                  Commits ({commits.length})
                </TabsTrigger>
                <TabsTrigger value="files" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Files ({getFilesByTask(taskId).filter((file) => canUserViewFile(file, currentUserId, task.assignees)).length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="discussion" className="mt-4">
                <CommentThread taskId={taskId} currentUserId={currentUserId} />
              </TabsContent>
              <TabsContent value="commits" className="mt-4">
                <CommitList commits={commits} />
              </TabsContent>
              <TabsContent value="files" className="mt-4">
                <TaskFilesSection
                  taskId={taskId}
                  taskAssignees={task.assignees}
                  currentUserId={currentUserId}
                  projectMembers={project?.members || []}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {!isEditMode && (
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant={task.status === 'review' ? 'outline' : 'default'}
              className="flex-1"
              onClick={() => handleStatusChange('review')}
              disabled={task.status === 'review' || task.status === 'done'}
            >
              Mark Ready for Review
            </Button>
            <Button
              variant={task.status === 'done' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => handleStatusChange('done')}
              disabled={task.status === 'done'}
            >
              {task.status === 'done' ? 'Completed ✓' : 'Mark as Done'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}