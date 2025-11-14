'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import {
  mockProjects,
  mockTasks,
  mockCommits,
  mockUsers,
  getUserById,
  getTasksByProject,
  Task,
  TaskStatus,
} from '../../data/mockData';
import { AlertCircle, GitCommit, CheckCircle2, Clock, TrendingUp, Folder } from 'lucide-react';

interface PMDashboardProps {
  userId: string;
  onNavigateToProject: (projectId: string) => void;
  onOpenTask?: (taskId: string) => void;
}

export function PMDashboard({ userId, onNavigateToProject, onOpenTask }: PMDashboardProps) {
  const userProjects = mockProjects.filter((p) => p.members.includes(userId));

  const getProjectProgress = (projectId: string) => {
    const tasks = getTasksByProject(projectId);
    const completed = tasks.filter((t) => t.status === 'done').length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  };

  const getStatusCounts = (projectId: string) => {
    const tasks = getTasksByProject(projectId);
    return {
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      review: tasks.filter((t) => t.status === 'review').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  };

  // Get tasks that need attention
  const blockedTasks = mockTasks.filter((t) => t.blocked_by && t.blocked_by.length > 0);
  const overdueOrHighPriority = mockTasks.filter(
    (t) =>
      t.status !== 'done' &&
      (t.priority === 'urgent' ||
        t.priority === 'high' ||
        (t.due_date && new Date(t.due_date) < new Date()))
  );

  // Recent commits
  const recentCommits = mockCommits
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

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
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl">Project Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Overview of your projects, team activity, and tasks requiring attention
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-600" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{userProjects.length}</div>
              <p className="text-xs text-muted-foreground">Projects in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{overdueOrHighPriority.length}</div>
              <p className="text-xs text-muted-foreground">High priority or overdue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                Blocked Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{blockedTasks.length}</div>
              <p className="text-xs text-muted-foreground">Tasks awaiting dependencies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-green-600" />
                Recent Commits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl">{recentCommits.length}</div>
              <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2>Projects</h2>
            {userProjects.map((project) => {
              const progress = getProjectProgress(project.id);
              const statusCounts = getStatusCounts(project.id);
              const projectTasks = getTasksByProject(project.id);

              return (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigateToProject(project.id)}
                      >
                        View
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    {/* Status breakdown */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-muted-foreground">{statusCounts.todo} To Do</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">
                          {statusCounts.inProgress} In Progress
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">{statusCounts.done} Done</span>
                      </div>
                    </div>

                    {/* Team members */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 4).map((memberId) => {
                          const user = getUserById(memberId);
                          return (
                            <Avatar key={memberId} className="w-7 h-7 border-2 border-white">
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
                      {project.members.length > 4 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.members.length - 4} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Right column - Attention needed & Activity */}
          <div className="space-y-6">
            {/* Needs Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueOrHighPriority.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{task.id}</span>
                        <Badge variant="secondary" className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{task.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            Due {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {overdueOrHighPriority.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm">All tasks on track!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Commits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="w-5 h-5" />
                  Recent Commits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCommits.map((commit) => {
                  const author = getUserById(commit.author_id);
                  return (
                    <div key={commit.id} className="flex items-start gap-3">
                      <Avatar className="w-8 h-8 mt-0.5">
                        <AvatarFallback className="text-xs">
                          {author?.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{commit.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{commit.hash}</span>
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
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}