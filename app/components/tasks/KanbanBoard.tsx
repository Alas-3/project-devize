'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Task, getUserById, getCommitsByTask } from '../../data/mockData';
import { GitCommit, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

export function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-gray-300' },
    { id: 'in-progress', title: 'In Progress', color: 'border-blue-500' },
    { id: 'review', title: 'Review', color: 'border-yellow-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' },
  ] as const;

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${column.color}`} />
                  <h3 className="font-medium">{column.title}</h3>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const commits = getCommitsByTask(task.id);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{task.id}</span>
            {task.blocked_by && task.blocked_by.length > 0 && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Blocked
              </Badge>
            )}
          </div>
          <p className="text-sm line-clamp-2">{task.title}</p>
        </div>

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map((label) => (
              <Badge key={label} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
            {task.labels.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{task.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Priority */}
        <div>
          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3">
            {commits.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitCommit className="w-3 h-3" />
                <span>{commits.length}</span>
              </div>
            )}
            {task.due_date && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-muted-foreground'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
          </div>
          {/* Assignees */}
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 2).map((assigneeId) => {
              const user = getUserById(assigneeId);
              return (
                <Avatar key={assigneeId} className="w-6 h-6 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {user?.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
