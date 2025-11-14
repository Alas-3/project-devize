'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { mockProjects, getUserById, getTasksByProject } from '../../data/mockData';
import { Plus, Folder } from 'lucide-react';

interface ProjectListProps {
  userId: string;
  onSelectProject: (projectId: string) => void;
}

export function ProjectList({ userId, onSelectProject }: ProjectListProps) {
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

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1>All Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your projects
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => {
            const progress = getProjectProgress(project.id);
            const statusCounts = getStatusCounts(project.id);
            const tasks = getTasksByProject(project.id);

            return (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectProject(project.id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {project.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    </div>
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
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-muted-foreground">{statusCounts.todo} To Do</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">
                        {statusCounts.inProgress} In Progress
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">
                        {statusCounts.review} Review
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">{statusCounts.done} Done</span>
                    </div>
                  </div>

                  {/* Team members */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 4).map((memberId) => {
                        const user = getUserById(memberId);
                        return (
                          <Avatar
                            key={memberId}
                            className="w-7 h-7 border-2 border-white"
                          >
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
                    <span className="text-xs text-muted-foreground">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>

                  {/* Repos */}
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1">
                      {project.repo_links.slice(0, 2).map((repo) => (
                        <Badge key={repo} variant="secondary" className="text-xs">
                          {repo.split('/').pop()}
                        </Badge>
                      ))}
                      {project.repo_links.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.repo_links.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {userProjects.length === 0 && (
          <div className="text-center py-16">
            <Folder className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3>No projects yet</h3>
            <p className="text-muted-foreground mt-2">
              Create your first project to get started
            </p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
