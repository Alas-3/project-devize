'use client'

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Commit, getUserById } from '../../data/mockData';
import { ExternalLink, GitBranch, GitMerge, XCircle } from 'lucide-react';

interface CommitListProps {
  commits: Commit[];
}

export function CommitList({ commits }: CommitListProps) {
  if (commits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No commits linked yet</p>
        <p className="text-xs mt-1">
          Reference this task in your commit message with the task ID
        </p>
      </div>
    );
  }

  const sortedCommits = [...commits].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedCommits.map((commit) => {
        const author = getUserById(commit.author_id);
        const timeAgo = getTimeAgo(new Date(commit.created_at));

        return (
          <div key={commit.id} className="p-4 border rounded-lg space-y-3">
            {/* Commit header */}
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {author?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">{author?.name}</span>
                  <span className="text-xs text-muted-foreground">committed {timeAgo}</span>
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
                    {commit.status === 'merged' && <GitMerge className="w-3 h-3 mr-1" />}
                    {commit.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {commit.status}
                  </Badge>
                </div>
                <p className="text-sm mt-1">{commit.message}</p>
              </div>
            </div>

            {/* Commit details */}
            <div className="flex items-center justify-between">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {commit.hash}
              </code>
              {commit.pr_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={commit.pr_url} target="_blank" rel="noopener noreferrer">
                    View PR
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              )}
            </div>

            {/* Visual timeline connector (except last item) */}
          </div>
        );
      })}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
