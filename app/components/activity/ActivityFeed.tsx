'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { mockCommits, mockComments, mockTasks, getUserById } from '../../data/mockData';
import { GitCommit, MessageSquare, CheckCircle2, PlayCircle } from 'lucide-react';

interface ActivityFeedProps {
  userId: string;
}

type Activity = {
  id: string;
  type: 'commit' | 'comment' | 'task_update';
  user_id: string;
  message: string;
  timestamp: string;
  task_id?: string;
};

export function ActivityFeed({ userId }: ActivityFeedProps) {
  // Combine all activities
  const activities: Activity[] = [
    ...mockCommits.map((c) => ({
      id: c.id,
      type: 'commit' as const,
      user_id: c.author_id,
      message: c.message,
      timestamp: c.created_at,
      task_id: c.task_id,
    })),
    ...mockComments.map((c) => ({
      id: c.id,
      type: 'comment' as const,
      user_id: c.author_id,
      message: `Commented: ${c.content.slice(0, 50)}...`,
      timestamp: c.created_at,
      task_id: c.task_id,
    })),
  ];

  // Sort by timestamp
  const sortedActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'task_update':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-8 space-y-6">
        <div>
          <h1>Activity Feed</h1>
          <p className="text-muted-foreground mt-1">
            Real-time updates from your team
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedActivities.map((activity) => {
                const user = getUserById(activity.user_id);
                return (
                  <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-0">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="text-xs">
                        {user?.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{user?.name}</span>
                        <Badge variant="outline" className="gap-1">
                          {getActivityIcon(activity.type)}
                          <span className="text-xs">{activity.type}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {getTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.message}</p>
                      {activity.task_id && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.task_id}
                        </Badge>
                      )}
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
