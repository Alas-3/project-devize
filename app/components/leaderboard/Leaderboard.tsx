'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Award, Trophy, Medal, Zap, Target } from 'lucide-react';
import { mockUsers, mockTasks, getTasksByAssignee, Task } from '../../data/mockData';

interface LeaderboardProps {
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

export function Leaderboard({ userId }: LeaderboardProps) {
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

    return {
      user: dev,
      completedTasks: completedTasks.length,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      totalPoints,
      isCurrentUser: dev.id === userId,
    };
  });

  // Sort by points
  const rankedDevs = [...devStats].sort((a, b) => b.totalPoints - a.totalPoints);
  const currentUserRank = rankedDevs.findIndex((d) => d.isCurrentUser) + 1;
  const currentUserStats = devStats.find((d) => d.isCurrentUser);

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1>Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Compete with your teammates and climb to the top!
          </p>
        </div>

        {/* Current User Stats */}
        {currentUserStats && (
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Badge className="w-12 h-12 flex items-center justify-center text-lg">
                    #{currentUserRank}
                  </Badge>
                  <div>
                    <div className="text-sm text-muted-foreground">Your Ranking</div>
                    <div className="text-2xl">{currentUserStats.user.name}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <div className="text-2xl">{currentUserStats.totalPoints}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl">{currentUserStats.completedTasks}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl">{currentUserStats.avgCompletionTime}d</div>
                    <div className="text-xs text-muted-foreground">Avg Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Point System Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Low Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl">100 pts</div>
              <p className="text-xs text-muted-foreground mt-1">Base points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Medium Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl">150 pts</div>
              <p className="text-xs text-muted-foreground mt-1">1.5x multiplier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-600" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl">200 pts</div>
              <p className="text-xs text-muted-foreground mt-1">2x multiplier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-red-600" />
                Urgent Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl">300 pts</div>
              <p className="text-xs text-muted-foreground mt-1">3x multiplier</p>
            </CardContent>
          </Card>
        </div>

        {/* Speed Bonuses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Speed Bonuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl text-green-600">+50</div>
                <div className="text-sm text-muted-foreground mt-1">≤1 day</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl text-blue-600">+30</div>
                <div className="text-sm text-muted-foreground mt-1">≤3 days</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl text-gray-600">+10</div>
                <div className="text-sm text-muted-foreground mt-1">≤7 days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankedDevs.map((dev, index) => {
                const isCurrentUser = dev.isCurrentUser;
                const rankIcon =
                  index === 0 ? (
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="w-6 h-6 text-gray-400" />
                  ) : index === 2 ? (
                    <Medal className="w-6 h-6 text-orange-600" />
                  ) : null;

                return (
                  <div
                    key={dev.user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      isCurrentUser
                        ? 'bg-primary/10 border-2 border-primary'
                        : index < 3
                        ? 'bg-muted/50'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="w-12 flex items-center justify-center">
                      {rankIcon || (
                        <Badge
                          variant={isCurrentUser ? 'default' : 'secondary'}
                          className="w-10 h-10 flex items-center justify-center"
                        >
                          #{index + 1}
                        </Badge>
                      )}
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {dev.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{dev.user.name}</span>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dev.completedTasks} tasks completed • {dev.avgCompletionTime}d avg
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
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
