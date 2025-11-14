'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  mockTasks,
  mockCommits,
  mockComments,
  getUserById,
  getTasksByAssignee,
  getCommitsByTask,
  Task,
  TaskStatus,
} from '../../data/mockData';
import {
  CheckCircle2,
  GitCommit,
  MessageSquare,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface DeveloperDashboardProps {
  userId: string;
  onOpenTask: (taskId: string) => void;
}

export function DeveloperDashboard({ userId, onOpenTask }: DeveloperDashboardProps) {
  const myTasks = getTasksByAssignee(userId);
  const myCommits = mockCommits.filter((c) => c.author_id === userId);

  // Tasks grouped by status
  const todoTasks = myTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = myTasks.filter((t) => t.status === 'in-progress');
  const reviewTasks = myTasks.filter((t) => t.status === 'review');
  const doneTasks = myTasks.filter((t) => t.status === 'done');

  // Mentions - comments where user is mentioned
  const myMentions = mockComments.filter((c) => {
    const user = getUserById(userId);
    return c.content.includes(`@${user?.name.toLowerCase().replace(' ', '')}`);
  });

  // Today's focus - high priority tasks
  const todaysFocus = myTasks
    .filter((t) => t.status !== 'done' && (t.priority === 'urgent' || t.priority === 'high'))
    .slice(0, 3);

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      done: 'bg-green-100 text-green-700',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1>My Workspace</h1>
          <p className="text-muted-foreground mt-1">
            Focus on your tasks, commits, and team discussions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">My Tasks</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {doneTasks.length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">In Progress</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{inProgressTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {reviewTasks.length} in review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">My Commits</CardTitle>
              <GitCommit className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myCommits.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {myCommits.filter((c) => c.status === 'merged').length} merged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Mentions</CardTitle>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{myMentions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Unread discussions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Focus */}
            {todaysFocus.length > 0 && (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Today's Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todaysFocus.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                      onClick={() => onOpenTask(task.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{task.id}</span>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(task.priority)}
                          >
                            {getPriorityIcon(task.priority)}
                            <span className="ml-1">{task.priority}</span>
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{task.title}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* My Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* In Progress */}
                {inProgressTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm text-muted-foreground">In Progress</span>
                      <Badge variant="secondary">{inProgressTasks.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {inProgressTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onClick={() => onOpenTask(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* In Review */}
                {reviewTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="text-sm text-muted-foreground">In Review</span>
                      <Badge variant="secondary">{reviewTasks.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {reviewTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onClick={() => onOpenTask(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* To Do */}
                {todoTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-sm text-muted-foreground">To Do</span>
                      <Badge variant="secondary">{todoTasks.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {todoTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onClick={() => onOpenTask(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {myTasks.filter((t) => t.status !== 'done').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <p>All tasks complete! 🎉</p>
                    <p className="text-sm mt-1">Great work!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity */}
          <div className="space-y-6">
            {/* My Commits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="w-5 h-5" />
                  Recent Commits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myCommits.slice(0, 5).map((commit) => (
                  <div key={commit.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{commit.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground font-mono">
                            {commit.hash}
                          </span>
                          <Badge
                            variant="secondary"
                            className={
                              commit.status === 'merged'
                                ? 'bg-green-100 text-green-700'
                                : commit.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {commit.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {commit.pr_url && (
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View PR
                      </Button>
                    )}
                  </div>
                ))}
                {myCommits.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No commits yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Mentions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Mentions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myMentions.slice(0, 4).map((mention) => {
                  const author = getUserById(mention.author_id);
                  return (
                    <div key={mention.id} className="flex items-start gap-2">
                      <Avatar className="w-7 h-7 mt-0.5">
                        <AvatarFallback className="text-xs">
                          {author?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {author?.name} in {mention.task_id}
                        </p>
                        <p className="text-sm mt-0.5 line-clamp-2">{mention.content}</p>
                      </div>
                    </div>
                  );
                })}
                {myMentions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No mentions yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, onClick }: { task: Task; onClick: () => void }) {
  const commits = getCommitsByTask(task.id);

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      review: 'bg-yellow-100 text-yellow-700',
      done: 'bg-green-100 text-green-700',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div
      className="p-3 rounded-lg border bg-white cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">{task.id}</span>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.blocked_by && task.blocked_by.length > 0 && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Blocked
              </Badge>
            )}
          </div>
          <p className="text-sm mt-1">{task.title}</p>
          <div className="flex items-center gap-3 mt-2">
            {commits.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitCommit className="w-3 h-3" />
                <span>{commits.length}</span>
              </div>
            )}
            {task.labels.map((label) => (
              <Badge key={label} variant="secondary" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
