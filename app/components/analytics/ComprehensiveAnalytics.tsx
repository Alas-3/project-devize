'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  Award,
  Calendar,
  Target,
  Activity,
  CheckCircle2,
  Users,
  GitBranch,
  Timer,
} from 'lucide-react';
import {
  mockTasks,
  mockUsers,
  mockProjects,
  getUserById,
  getTasksByAssignee,
  Task,
} from '../../data/mockData';

interface ComprehensiveAnalyticsProps {
  userId: string;
}

// Calculate task completion time in days
function getCompletionTime(task: Task): number | null {
  if (!task.completed_at) return null;
  const created = new Date(task.created_at).getTime();
  const completed = new Date(task.completed_at).getTime();
  return Math.round((completed - created) / (1000 * 60 * 60 * 24));
}

// Calculate points based on priority and speed
function calculatePoints(task: Task): number {
  const completionTime = getCompletionTime(task);
  if (completionTime === null) return 0;

  const priorityMultiplier = {
    low: 1,
    medium: 1.5,
    high: 2,
    urgent: 3,
  };

  const basePoints = 100;
  const multiplier = priorityMultiplier[task.priority];

  // Bonus points for fast completion
  let speedBonus = 0;
  if (completionTime <= 1) speedBonus = 50;
  else if (completionTime <= 3) speedBonus = 30;
  else if (completionTime <= 7) speedBonus = 10;

  return Math.round(basePoints * multiplier + speedBonus);
}

// Check if task is overdue
function isOverdue(task: Task): boolean {
  if (!task.due_date || task.status === 'done') return false;
  return new Date(task.due_date) < new Date();
}

// Get days until due
function getDaysUntilDue(task: Task): number | null {
  if (!task.due_date) return null;
  const now = new Date().getTime();
  const due = new Date(task.due_date).getTime();
  return Math.round((due - now) / (1000 * 60 * 60 * 24));
}

export function ComprehensiveAnalytics({ userId }: ComprehensiveAnalyticsProps) {
  const developers = mockUsers.filter((u) => u.role === 'developer');

  // Overall KPIs
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter((t) => t.status === 'done');
  const inProgressTasks = mockTasks.filter((t) => t.status === 'in-progress');
  const overdueTasks = mockTasks.filter(isOverdue);
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  // Schedule tracking
  const today = new Date();
  const thisWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 7);
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const dueTodayTasks = mockTasks.filter((t) => {
    if (!t.due_date || t.status === 'done') return false;
    const due = new Date(t.due_date);
    return due.toDateString() === new Date().toDateString();
  });

  const dueThisWeekTasks = mockTasks.filter((t) => {
    if (!t.due_date || t.status === 'done') return false;
    const due = new Date(t.due_date);
    return due >= thisWeekStart && due <= thisWeekEnd;
  });

  const dueThisMonthTasks = mockTasks.filter((t) => {
    if (!t.due_date || t.status === 'done') return false;
    const due = new Date(t.due_date);
    return due >= thisMonthStart && due <= thisMonthEnd;
  });

  // Calculate stats for each developer
  const devStats = developers.map((dev) => {
    const tasks = getTasksByAssignee(dev.id);
    const completed = tasks.filter((t) => t.status === 'done');
    const active = tasks.filter((t) => t.status === 'in-progress');
    const overdue = tasks.filter(isOverdue);
    
    const avgCompletionTime =
      completed.length > 0
        ? completed.reduce((sum, t) => sum + (getCompletionTime(t) || 0), 0) / completed.length
        : 0;
    
    const totalPoints = completed.reduce((sum, t) => sum + calculatePoints(t), 0);
    
    // Calculate velocity (tasks per week)
    const velocity = completed.length > 0 ? completed.length / 4 : 0;

    // Efficiency score (0-100)
    const efficiency = completed.length > 0
      ? Math.min(100, Math.round((100 - avgCompletionTime * 5) + (velocity * 10)))
      : 0;

    return {
      user: dev,
      completedTasks: completed.length,
      activeTasks: active.length,
      overdueTasks: overdue.length,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      totalPoints,
      velocity: Math.round(velocity * 10) / 10,
      efficiency,
    };
  });

  // Sort by performance
  const topPerformers = [...devStats].sort((a, b) => b.totalPoints - a.totalPoints);
  const slowestPerformers = [...devStats]
    .filter((d) => d.avgCompletionTime > 0)
    .sort((a, b) => b.avgCompletionTime - a.avgCompletionTime)
    .slice(0, 5);

  // Task analytics
  const fastTasks = completedTasks
    .map((t) => ({ task: t, time: getCompletionTime(t) || 0 }))
    .filter((t) => t.time > 0 && t.time <= 3)
    .sort((a, b) => a.time - b.time)
    .slice(0, 5);

  const slowTasks = completedTasks
    .map((t) => ({ task: t, time: getCompletionTime(t) || 0 }))
    .filter((t) => t.time > 7)
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  // Project progress
  const projectStats = mockProjects.map((project) => {
    const tasks = mockTasks.filter((t) => t.project_id === project.id);
    const completed = tasks.filter((t) => t.status === 'done');
    const progress = tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0;
    const overdue = tasks.filter(isOverdue).length;

    return {
      project,
      totalTasks: tasks.length,
      completedTasks: completed.length,
      progress: Math.round(progress),
      overdue,
    };
  });

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1>Analytics & Performance</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into team productivity and project health
          </p>
        </div>

        {/* Overall KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">{completedTasks.length}</div>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={completionRate} className="h-1" />
                <span className="text-xs text-muted-foreground">{Math.round(completionRate)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-blue-600">{inProgressTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active work</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-orange-600">{overdueTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{developers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active developers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList>
            <TabsTrigger value="schedule">Schedule Tracking</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="projects">Project Health</TabsTrigger>
            <TabsTrigger value="tasks">Task Analysis</TabsTrigger>
          </TabsList>

          {/* Schedule Tracking Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Due Today */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="w-4 h-4 text-red-600" />
                    Due Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl mb-4">{dueTodayTasks.length}</div>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {dueTodayTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="p-2 border rounded-lg text-sm">
                        <div className="truncate">{task.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{task.id}</div>
                      </div>
                    ))}
                    {dueTodayTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground">No tasks due today</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Due This Week */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    Due This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl mb-4">{dueThisWeekTasks.length}</div>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {dueThisWeekTasks.slice(0, 5).map((task) => {
                      const daysLeft = getDaysUntilDue(task);
                      return (
                        <div key={task.id} className="p-2 border rounded-lg text-sm">
                          <div className="truncate">{task.title}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">{task.id}</span>
                            {daysLeft !== null && (
                              <Badge variant="secondary" className="text-xs">
                                {daysLeft}d left
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {dueThisWeekTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground">No tasks due this week</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Due This Month */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Due This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl mb-4">{dueThisMonthTasks.length}</div>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {dueThisMonthTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="p-2 border rounded-lg text-sm">
                        <div className="truncate">{task.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(task.due_date!).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Schedule Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-sm">On Schedule</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Tasks progressing as planned
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-2xl text-green-600">
                        {totalTasks - overdueTasks.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <div>
                      <div className="text-sm">Behind Schedule</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Overdue and need attention
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-orange-600" />
                      <span className="text-2xl text-orange-600">{overdueTasks.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div>
                      <div className="text-sm">Completion Rate</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Overall project progress
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={completionRate} className="w-32" />
                      <span className="text-2xl text-blue-600">{Math.round(completionRate)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Performance Tab */}
          <TabsContent value="team" className="space-y-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.slice(0, 5).map((dev, index) => (
                    <div key={dev.user.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <Badge variant={index === 0 ? 'default' : 'secondary'} className="w-8">
                        #{index + 1}
                      </Badge>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {dev.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm">{dev.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {dev.completedTasks} completed • {dev.velocity} tasks/week
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">{dev.totalPoints} pts</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dev.efficiency}% efficiency
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Needs Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Needs Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slowestPerformers.map((dev) => (
                    <div key={dev.user.id} className="flex items-center gap-4 p-3 border rounded-lg bg-orange-50 border-orange-200">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {dev.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm">{dev.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {dev.avgCompletionTime}d avg completion • {dev.activeTasks} active tasks
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {dev.overdueTasks > 0 && (
                          <Badge variant="destructive">
                            {dev.overdueTasks} overdue
                          </Badge>
                        )}
                        <Badge variant="outline">{dev.efficiency}% eff</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Health Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {projectStats.map((stat) => (
                <Card key={stat.project.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{stat.project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{stat.progress}%</span>
                        </div>
                        <Progress value={stat.progress} />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xl">{stat.totalTasks}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div>
                          <div className="text-xl text-green-600">{stat.completedTasks}</div>
                          <div className="text-xs text-muted-foreground">Done</div>
                        </div>
                        <div>
                          <div className="text-xl text-orange-600">{stat.overdue}</div>
                          <div className="text-xs text-muted-foreground">Overdue</div>
                        </div>
                      </div>
                      {stat.overdue > 0 && (
                        <Badge variant="destructive" className="w-full justify-center">
                          {stat.overdue} tasks behind schedule
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Task Analysis Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fast Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Fastest Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fastTasks.map(({ task, time }) => {
                      const assignee = getUserById(task.assignees[0]);
                      return (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">{task.id}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {time}d
                            </Badge>
                          </div>
                          <p className="text-sm">{task.title}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {assignee?.name} • {calculatePoints(task)} points
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Slow Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Slowest Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {slowTasks.map(({ task, time }) => {
                      const assignee = getUserById(task.assignees[0]);
                      return (
                        <div key={task.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">{task.id}</span>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              {time}d
                            </Badge>
                          </div>
                          <p className="text-sm">{task.title}</p>
                          <div className="text-xs text-muted-foreground mt-1">{assignee?.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
