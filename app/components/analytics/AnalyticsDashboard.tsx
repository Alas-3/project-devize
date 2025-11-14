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
} from 'lucide-react';
import {
  mockTasks,
  mockUsers,
  getUserById,
  getTasksByAssignee,
  Task,
} from '../../data/mockData';

interface AnalyticsDashboardProps {
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

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const developers = mockUsers.filter((u) => u.role === 'developer');

  // Calculate stats for each developer
  const devStats = developers.map((dev) => {
    const tasks = getTasksByAssignee(dev.id);
    const completedTasks = tasks.filter((t) => t.status === 'done');
    const avgCompletionTime =
      completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => sum + (getCompletionTime(t) || 0), 0) /
          completedTasks.length
        : 0;
    const totalPoints = completedTasks.reduce((sum, t) => sum + calculatePoints(t), 0);
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
    const overdueTasks = tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    );

    return {
      user: dev,
      completedTasks: completedTasks.length,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      totalPoints,
      inProgressTasks: inProgressTasks.length,
      overdueTasks: overdueTasks.length,
      velocity: completedTasks.length > 0 ? completedTasks.length / 4 : 0, // tasks per week (assuming 4 weeks)
    };
  });

  // Sort by performance
  const topPerformers = [...devStats].sort((a, b) => b.totalPoints - a.totalPoints);
  const slowPerformers = [...devStats]
    .filter((d) => d.avgCompletionTime > 0)
    .sort((a, b) => b.avgCompletionTime - a.avgCompletionTime)
    .slice(0, 5);

  // Task analytics
  const allCompletedTasks = mockTasks.filter((t) => t.status === 'done');
  const fastTasks = allCompletedTasks
    .map((t) => ({ task: t, time: getCompletionTime(t) || 0 }))
    .filter((t) => t.time > 0 && t.time <= 3)
    .sort((a, b) => a.time - b.time);

  const slowTasks = allCompletedTasks
    .map((t) => ({ task: t, time: getCompletionTime(t) || 0 }))
    .filter((t) => t.time > 7)
    .sort((a, b) => b.time - a.time);

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1>Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track team performance and identify bottlenecks
          </p>
        </div>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Team Performance Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Developers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{developers.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Avg Completion Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">
                    {Math.round(
                      devStats.reduce((sum, d) => sum + d.avgCompletionTime, 0) /
                        devStats.length
                    )}
                    d
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Per task</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Tasks Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">
                    {devStats.reduce((sum, d) => sum + d.completedTasks, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Overdue Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-orange-600">
                    {devStats.reduce((sum, d) => sum + d.overdueTasks, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Need attention</p>
                </CardContent>
              </Card>
            </div>

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
                    <div key={dev.user.id} className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
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
                            {dev.completedTasks} tasks completed
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">{dev.totalPoints} pts</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dev.avgCompletionTime}d avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Needs Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                  Needs Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slowPerformers.map((dev) => (
                    <div key={dev.user.id} className="flex items-center gap-4">
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
                          {dev.avgCompletionTime}d average completion time
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {dev.inProgressTasks} active
                        </div>
                        {dev.overdueTasks > 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {dev.overdueTasks} overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Analytics Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fast Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Fastest Completed Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fastTasks.slice(0, 5).map(({ task, time }) => {
                      const assignee = getUserById(task.assignees[0]);
                      return (
                        <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="flex-1">
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
                    Slowest Completed Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {slowTasks.slice(0, 5).map(({ task, time }) => {
                      const assignee = getUserById(task.assignees[0]);
                      return (
                        <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground">{task.id}</span>
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                {time}d
                              </Badge>
                            </div>
                            <p className="text-sm">{task.title}</p>
                            <div className="text-xs text-muted-foreground mt-1">
                              {assignee?.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Developer Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((dev, index) => (
                    <div
                      key={dev.user.id}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        index < 3 ? 'bg-muted/50' : ''
                      }`}
                    >
                      <Badge
                        variant={index === 0 ? 'default' : 'secondary'}
                        className={`w-10 h-10 flex items-center justify-center text-base ${
                          index === 0
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : index === 1
                            ? 'bg-gray-400 hover:bg-gray-500'
                            : index === 2
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : ''
                        }`}
                      >
                        #{index + 1}
                      </Badge>
                      <Avatar className="w-12 h-12">
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
                          {dev.completedTasks} tasks • {dev.avgCompletionTime}d avg time
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-yellow-600" />
                          <span className="text-xl">{dev.totalPoints}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
