'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { KanbanBoard } from '../tasks/KanbanBoard';
import { TaskDetailPanel } from '../tasks/TaskDetailPanel';
import { ProjectSettingsPanel } from '../panels/ProjectSettingsPanel';
import { NewTaskPanel } from '../panels/NewTaskPanel';
import {
  getProjectById,
  getTasksByProject,
  getUserById,
  mockCommits,
  Project,
} from '../../data/mockData';
import {
  ArrowLeft,
  Users,
  GitBranch,
  LayoutGrid,
  List,
  Settings,
  Plus,
} from 'lucide-react';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  currentUserId: string;
}

export function ProjectDetail({ projectId, onBack, currentUserId }: ProjectDetailProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showSettings, setShowSettings] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);

  const project = getProjectById(projectId);
  if (!project) return null;

  const tasks = getTasksByProject(projectId);
  const projectCommits = mockCommits.filter((c) =>
    tasks.some((t) => t.id === c.task_id)
  );

  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1>{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={() => setShowNewTask(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Project stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl">{Math.round(progress)}%</div>
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">
                  {completedTasks} of {tasks.length} tasks complete
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((memberId) => {
                    const user = getUserById(memberId);
                    return (
                      <Avatar key={memberId} className="w-8 h-8 border-2 border-white">
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
                {project.members.length > 3 && (
                  <span className="text-sm text-muted-foreground">
                    +{project.members.length - 3}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {project.repo_links.slice(0, 2).map((repo) => (
                  <div key={repo} className="flex items-center gap-2 text-sm">
                    <GitBranch className="w-3 h-3" />
                    <span className="truncate">{repo.split('/').pop()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{projectCommits.length}</div>
              <p className="text-xs text-muted-foreground">commits this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'board' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'board' ? (
              <div className="h-[600px]">
                <KanbanBoard tasks={tasks} onTaskClick={setSelectedTaskId} />
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedTaskId(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{task.id}</span>
                        <span className="text-sm">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{task.status}</Badge>
                        <Badge variant="outline">{task.priority}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Detail Panel */}
      {selectedTaskId && (
        <TaskDetailPanel
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          currentUserId={currentUserId}
        />
      )}

      {/* Project Settings Panel */}
      {showSettings && (
        <ProjectSettingsPanel
          projectId={projectId}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* New Task Panel */}
      {showNewTask && (
        <NewTaskPanel
          projectId={projectId}
          onClose={() => setShowNewTask(false)}
        />
      )}
    </div>
  );
}