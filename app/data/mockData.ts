// Mock data for Devize

export type UserRole = 'admin' | 'pm' | 'developer' | 'qa' | 'designer' | string; // Allow custom roles
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type FilePrivacy = 'public' | 'assignees-only' | 'specific-members';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  customRole?: string; // For custom roles created by PMs
  avatar?: string;
  points?: number; // For developer leaderboard
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  repo_links: string[];
  created_at: string;
  members: string[];
  labels?: string[];
  customRoles?: string[]; // Track custom roles created for this project
}

export interface Commit {
  id: string;
  task_id: string;
  message: string;
  author_id: string;
  hash: string;
  pr_url?: string;
  created_at: string;
  status: 'pending' | 'merged' | 'rejected';
}

export interface Comment {
  id: string;
  task_id: string;
  author_id: string;
  content: string;
  created_at: string;
  parent_id?: string;
  reactions: { emoji: string; user_ids: string[] }[];
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignees: string[];
  priority: TaskPriority;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  labels: string[];
  blocked_by?: string[];
}

export interface RepoRequest {
  id: string;
  project_id: string;
  repo_url: string;
  requested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface TaskFile {
  id: string;
  task_id: string;
  filename: string;
  file_url: string;
  file_type: string; // e.g., 'image/png', 'application/pdf', 'text/csv'
  file_size: number; // in bytes
  uploaded_by: string;
  uploaded_at: string;
  privacy: FilePrivacy;
  allowed_users?: string[]; // For 'specific-members' privacy
  description?: string;
}

export interface TaskCompletionAnalytics {
  task_id: string;
  user_id: string;
  completion_time_hours: number; // Time from assignment to completion
  created_at: string;
  completed_at: string;
}

// Mock Users - expanded with custom roles
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'sarah@devize.com',
    role: 'pm',
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    email: 'alex@devize.com',
    role: 'developer',
    points: 1850,
  },
  {
    id: 'user-3',
    name: 'Marcus Johnson',
    email: 'marcus@devize.com',
    role: 'developer',
    points: 1620,
  },
  {
    id: 'user-4',
    name: 'Emma Wilson',
    email: 'emma@devize.com',
    role: 'qa',
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david@devize.com',
    role: 'designer',
  },
  {
    id: 'user-6',
    name: 'Sofia Martinez',
    email: 'sofia@devize.com',
    role: 'developer',
    points: 2120,
  },
  {
    id: 'user-7',
    name: 'James Lee',
    email: 'james@devize.com',
    role: 'developer',
    points: 980,
  },
  {
    id: 'user-8',
    name: 'Olivia Brown',
    email: 'olivia@devize.com',
    role: 'pm',
  },
  {
    id: 'user-9',
    name: 'Ryan Taylor',
    email: 'ryan@devize.com',
    role: 'developer',
    points: 1340,
  },
  {
    id: 'user-10',
    name: 'Priya Patel',
    email: 'priya@devize.com',
    role: 'qa',
  },
];

// Mock Projects - expanded
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Devize Platform',
    description: 'The main Devize application - bridging GitHub, Jira, and Slack',
    owner_id: 'user-1',
    repo_links: ['https://github.com/devize/platform', 'https://github.com/devize/api'],
    created_at: '2025-10-01T10:00:00Z',
    members: ['user-1', 'user-2', 'user-3', 'user-4', 'user-6'],
    labels: ['Core', 'High Priority', 'Q4 2025'],
  },
  {
    id: 'proj-2',
    name: 'Mobile App',
    description: 'Devize mobile companion app for iOS and Android',
    owner_id: 'user-1',
    repo_links: ['https://github.com/devize/mobile'],
    created_at: '2025-10-15T14:30:00Z',
    members: ['user-1', 'user-2', 'user-5', 'user-7'],
    labels: ['Mobile', 'Cross-platform'],
  },
  {
    id: 'proj-3',
    name: 'Analytics Dashboard',
    description: 'Advanced analytics and reporting module',
    owner_id: 'user-1',
    repo_links: ['https://github.com/devize/analytics'],
    created_at: '2025-11-01T09:00:00Z',
    members: ['user-1', 'user-3', 'user-4', 'user-6'],
    labels: ['Analytics', 'Data Visualization'],
  },
  {
    id: 'proj-4',
    name: 'Design System',
    description: 'Unified design system and component library',
    owner_id: 'user-8',
    repo_links: ['https://github.com/devize/design-system'],
    created_at: '2025-09-20T11:00:00Z',
    members: ['user-5', 'user-8', 'user-2'],
    labels: ['UI/UX', 'Components'],
  },
  {
    id: 'proj-5',
    name: 'API Gateway',
    description: 'Microservices API gateway and authentication',
    owner_id: 'user-1',
    repo_links: ['https://github.com/devize/gateway', 'https://github.com/devize/auth-service'],
    created_at: '2025-10-10T08:00:00Z',
    members: ['user-1', 'user-3', 'user-6', 'user-7', 'user-9'],
    labels: ['Backend', 'Infrastructure'],
  },
];

// Mock Tasks - significantly expanded
export const mockTasks: Task[] = [
  {
    id: 'TASK-1',
    project_id: 'proj-1',
    title: 'Implement real-time task updates',
    description: 'Add WebSocket support for live task status changes across all connected clients',
    status: 'in-progress',
    assignees: ['user-2'],
    priority: 'high',
    due_date: '2025-11-15T00:00:00Z',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-07T15:30:00Z',
    labels: ['feature', 'backend'],
  },
  {
    id: 'TASK-2',
    project_id: 'proj-1',
    title: 'Design comment thread UI',
    description: 'Create Slack-style threaded comments with mentions and reactions',
    status: 'review',
    assignees: ['user-5'],
    priority: 'medium',
    due_date: '2025-11-12T00:00:00Z',
    created_at: '2025-10-28T09:00:00Z',
    updated_at: '2025-11-06T11:20:00Z',
    labels: ['design', 'ui'],
  },
  {
    id: 'TASK-3',
    project_id: 'proj-1',
    title: 'GitHub OAuth integration',
    description: 'Allow users to connect their GitHub accounts and link repositories',
    status: 'done',
    assignees: ['user-2'],
    priority: 'urgent',
    created_at: '2025-10-20T14:00:00Z',
    updated_at: '2025-11-05T16:45:00Z',
    completed_at: '2025-11-05T16:45:00Z',
    labels: ['feature', 'integration'],
  },
  {
    id: 'TASK-4',
    project_id: 'proj-1',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment workflows',
    status: 'todo',
    assignees: ['user-3'],
    priority: 'medium',
    due_date: '2025-11-20T00:00:00Z',
    created_at: '2025-11-03T10:00:00Z',
    updated_at: '2025-11-03T10:00:00Z',
    labels: ['devops', 'infrastructure'],
  },
  {
    id: 'TASK-5',
    project_id: 'proj-1',
    title: 'Fix task drag-and-drop on mobile',
    description: 'Kanban board drag functionality is broken on touch devices',
    status: 'in-progress',
    assignees: ['user-3'],
    priority: 'high',
    due_date: '2025-11-10T00:00:00Z',
    created_at: '2025-11-02T11:30:00Z',
    updated_at: '2025-11-07T09:15:00Z',
    labels: ['bug', 'mobile'],
    blocked_by: ['TASK-1'],
  },
  {
    id: 'TASK-6',
    project_id: 'proj-1',
    title: 'Optimize database queries',
    description: 'Dashboard loading is slow with large datasets',
    status: 'todo',
    assignees: ['user-6'],
    priority: 'high',
    due_date: '2025-11-18T00:00:00Z',
    created_at: '2025-11-04T13:00:00Z',
    updated_at: '2025-11-04T13:00:00Z',
    labels: ['performance', 'backend'],
  },
  {
    id: 'TASK-7',
    project_id: 'proj-2',
    title: 'Implement push notifications',
    description: 'Add Firebase Cloud Messaging for task updates',
    status: 'in-progress',
    assignees: ['user-2'],
    priority: 'high',
    due_date: '2025-11-16T00:00:00Z',
    created_at: '2025-10-25T09:00:00Z',
    updated_at: '2025-11-07T14:20:00Z',
    labels: ['feature', 'mobile'],
  },
  {
    id: 'TASK-8',
    project_id: 'proj-2',
    title: 'Design offline mode',
    description: 'Allow users to view and edit tasks without internet connection',
    status: 'todo',
    assignees: ['user-7'],
    priority: 'medium',
    due_date: '2025-11-25T00:00:00Z',
    created_at: '2025-11-02T10:00:00Z',
    updated_at: '2025-11-02T10:00:00Z',
    labels: ['feature', 'ux'],
  },
  {
    id: 'TASK-9',
    project_id: 'proj-2',
    title: 'Fix iOS keyboard covering input',
    description: 'Input fields are obscured by keyboard on iPhone',
    status: 'done',
    assignees: ['user-2'],
    priority: 'medium',
    created_at: '2025-10-30T11:00:00Z',
    updated_at: '2025-11-04T16:30:00Z',
    completed_at: '2025-11-04T16:30:00Z',
    labels: ['bug', 'ios'],
  },
  {
    id: 'TASK-10',
    project_id: 'proj-3',
    title: 'Export analytics data',
    description: 'Allow users to export reports as PDF or CSV',
    status: 'review',
    assignees: ['user-3'],
    priority: 'medium',
    due_date: '2025-11-14T00:00:00Z',
    created_at: '2025-11-01T08:00:00Z',
    updated_at: '2025-11-07T10:00:00Z',
    labels: ['feature', 'analytics'],
  },
  {
    id: 'TASK-11',
    project_id: 'proj-3',
    title: 'Create velocity charts',
    description: 'Visualize team performance over time',
    status: 'in-progress',
    assignees: ['user-6'],
    priority: 'high',
    due_date: '2025-11-13T00:00:00Z',
    created_at: '2025-11-03T09:00:00Z',
    updated_at: '2025-11-07T11:45:00Z',
    labels: ['feature', 'charts'],
  },
  {
    id: 'TASK-12',
    project_id: 'proj-3',
    title: 'Fix chart rendering bug',
    description: 'Bar charts not displaying correctly on Safari',
    status: 'todo',
    assignees: ['user-3'],
    priority: 'low',
    created_at: '2025-11-05T15:00:00Z',
    updated_at: '2025-11-05T15:00:00Z',
    labels: ['bug', 'ui'],
    blocked_by: ['TASK-11'],
  },
  {
    id: 'TASK-13',
    project_id: 'proj-4',
    title: 'Document component API',
    description: 'Write comprehensive documentation for all components',
    status: 'in-progress',
    assignees: ['user-5'],
    priority: 'medium',
    due_date: '2025-11-20T00:00:00Z',
    created_at: '2025-10-22T10:00:00Z',
    updated_at: '2025-11-06T16:00:00Z',
    labels: ['documentation'],
  },
  {
    id: 'TASK-14',
    project_id: 'proj-4',
    title: 'Create button variants',
    description: 'Design and implement all button states and sizes',
    status: 'done',
    assignees: ['user-5'],
    priority: 'high',
    created_at: '2025-10-18T09:00:00Z',
    updated_at: '2025-10-28T14:30:00Z',
    completed_at: '2025-10-28T14:30:00Z',
    labels: ['design', 'components'],
  },
  {
    id: 'TASK-15',
    project_id: 'proj-4',
    title: 'Setup Storybook',
    description: 'Configure Storybook for component development',
    status: 'done',
    assignees: ['user-2'],
    priority: 'medium',
    created_at: '2025-10-15T11:00:00Z',
    updated_at: '2025-10-25T09:20:00Z',
    completed_at: '2025-10-25T09:20:00Z',
    labels: ['tooling'],
  },
  {
    id: 'TASK-16',
    project_id: 'proj-5',
    title: 'Implement JWT authentication',
    description: 'Add token-based auth to API gateway',
    status: 'done',
    assignees: ['user-3'],
    priority: 'urgent',
    created_at: '2025-10-12T08:00:00Z',
    updated_at: '2025-10-30T17:00:00Z',
    completed_at: '2025-10-30T17:00:00Z',
    labels: ['security', 'backend'],
  },
  {
    id: 'TASK-17',
    project_id: 'proj-5',
    title: 'Setup rate limiting',
    description: 'Protect API endpoints from abuse',
    status: 'review',
    assignees: ['user-6'],
    priority: 'high',
    due_date: '2025-11-11T00:00:00Z',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-07T13:00:00Z',
    labels: ['security', 'backend'],
  },
  {
    id: 'TASK-18',
    project_id: 'proj-5',
    title: 'Add API documentation',
    description: 'Generate OpenAPI specs for all endpoints',
    status: 'todo',
    assignees: ['user-9'],
    priority: 'medium',
    due_date: '2025-11-22T00:00:00Z',
    created_at: '2025-11-05T09:00:00Z',
    updated_at: '2025-11-05T09:00:00Z',
    labels: ['documentation'],
  },
  {
    id: 'TASK-19',
    project_id: 'proj-1',
    title: 'Refactor notification system',
    description: 'Consolidate notification logic into reusable service',
    status: 'todo',
    assignees: ['user-6'],
    priority: 'low',
    created_at: '2025-11-06T10:00:00Z',
    updated_at: '2025-11-06T10:00:00Z',
    labels: ['refactor', 'backend'],
  },
  {
    id: 'TASK-20',
    project_id: 'proj-1',
    title: 'Add dark mode',
    description: 'Implement dark theme across the application',
    status: 'in-progress',
    assignees: ['user-2', 'user-5'],
    priority: 'medium',
    due_date: '2025-11-19T00:00:00Z',
    created_at: '2025-11-04T14:00:00Z',
    updated_at: '2025-11-07T12:00:00Z',
    labels: ['feature', 'ui'],
  },
];

// Mock Commits - expanded
export const mockCommits: Commit[] = [
  {
    id: 'commit-1',
    task_id: 'TASK-1',
    message: 'feat: Add WebSocket connection handler',
    author_id: 'user-2',
    hash: 'a1b2c3d',
    pr_url: 'https://github.com/devize/platform/pull/42',
    created_at: '2025-11-07T14:30:00Z',
    status: 'pending',
  },
  {
    id: 'commit-2',
    task_id: 'TASK-1',
    message: 'feat: Implement task update broadcasting',
    author_id: 'user-2',
    hash: 'e4f5g6h',
    created_at: '2025-11-07T15:15:00Z',
    status: 'pending',
  },
  {
    id: 'commit-3',
    task_id: 'TASK-3',
    message: 'feat: Complete GitHub OAuth flow',
    author_id: 'user-2',
    hash: 'i7j8k9l',
    pr_url: 'https://github.com/devize/platform/pull/38',
    created_at: '2025-11-05T16:00:00Z',
    status: 'merged',
  },
  {
    id: 'commit-4',
    task_id: 'TASK-5',
    message: 'fix: Update touch event handlers for mobile',
    author_id: 'user-3',
    hash: 'm1n2o3p',
    created_at: '2025-11-07T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'commit-5',
    task_id: 'TASK-7',
    message: 'feat: Configure FCM for push notifications',
    author_id: 'user-2',
    hash: 'q4r5s6t',
    pr_url: 'https://github.com/devize/mobile/pull/15',
    created_at: '2025-11-07T14:00:00Z',
    status: 'pending',
  },
  {
    id: 'commit-6',
    task_id: 'TASK-9',
    message: 'fix: Adjust viewport for iOS keyboard',
    author_id: 'user-2',
    hash: 'u7v8w9x',
    created_at: '2025-11-04T16:00:00Z',
    status: 'merged',
  },
  {
    id: 'commit-7',
    task_id: 'TASK-10',
    message: 'feat: Add PDF export functionality',
    author_id: 'user-3',
    hash: 'y1z2a3b',
    pr_url: 'https://github.com/devize/analytics/pull/8',
    created_at: '2025-11-07T10:00:00Z',
    status: 'pending',
  },
  {
    id: 'commit-8',
    task_id: 'TASK-11',
    message: 'feat: Create velocity chart component',
    author_id: 'user-6',
    hash: 'c4d5e6f',
    created_at: '2025-11-07T11:30:00Z',
    status: 'pending',
  },
  {
    id: 'commit-9',
    task_id: 'TASK-14',
    message: 'feat: Implement all button variants',
    author_id: 'user-5',
    hash: 'g7h8i9j',
    created_at: '2025-10-28T14:00:00Z',
    status: 'merged',
  },
  {
    id: 'commit-10',
    task_id: 'TASK-16',
    message: 'feat: Add JWT token generation and validation',
    author_id: 'user-3',
    hash: 'k1l2m3n',
    pr_url: 'https://github.com/devize/gateway/pull/23',
    created_at: '2025-10-30T16:45:00Z',
    status: 'merged',
  },
  {
    id: 'commit-11',
    task_id: 'TASK-17',
    message: 'feat: Implement rate limiting middleware',
    author_id: 'user-6',
    hash: 'o4p5q6r',
    pr_url: 'https://github.com/devize/gateway/pull/25',
    created_at: '2025-11-07T12:45:00Z',
    status: 'pending',
  },
  {
    id: 'commit-12',
    task_id: 'TASK-20',
    message: 'feat: Add dark mode color palette',
    author_id: 'user-2',
    hash: 's7t8u9v',
    created_at: '2025-11-07T11:00:00Z',
    status: 'pending',
  },
];

// Mock Comments - expanded
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    task_id: 'TASK-1',
    author_id: 'user-1',
    content: 'Great progress! Make sure to handle connection drops gracefully.',
    created_at: '2025-11-07T15:45:00Z',
    reactions: [{ emoji: '👍', user_ids: ['user-2', 'user-3'] }],
  },
  {
    id: 'comment-2',
    task_id: 'TASK-1',
    author_id: 'user-2',
    content: 'Will do! Adding reconnection logic now.',
    created_at: '2025-11-07T15:50:00Z',
    parent_id: 'comment-1',
    reactions: [],
  },
  {
    id: 'comment-3',
    task_id: 'TASK-5',
    author_id: 'user-3',
    content: 'This is blocked by TASK-1. Once WebSockets are ready, I can test properly.',
    created_at: '2025-11-07T09:30:00Z',
    reactions: [],
  },
  {
    id: 'comment-4',
    task_id: 'TASK-7',
    author_id: 'user-1',
    content: 'Push notifications are critical for mobile UX. Priority this week!',
    created_at: '2025-11-06T10:00:00Z',
    reactions: [{ emoji: '🔥', user_ids: ['user-2', 'user-7'] }],
  },
  {
    id: 'comment-5',
    task_id: 'TASK-10',
    author_id: 'user-6',
    content: 'CSV export is working. PDF needs some styling fixes.',
    created_at: '2025-11-07T10:15:00Z',
    reactions: [],
  },
  {
    id: 'comment-6',
    task_id: 'TASK-10',
    author_id: 'user-1',
    content: 'Looks good! Can you add a loading state while generating?',
    created_at: '2025-11-07T10:20:00Z',
    parent_id: 'comment-5',
    reactions: [{ emoji: '✅', user_ids: ['user-3'] }],
  },
  {
    id: 'comment-7',
    task_id: 'TASK-11',
    author_id: 'user-6',
    content: 'Chart is rendering but data aggregation needs optimization.',
    created_at: '2025-11-07T11:50:00Z',
    reactions: [],
  },
  {
    id: 'comment-8',
    task_id: 'TASK-13',
    author_id: 'user-5',
    content: 'Documentation is 60% complete. Should be done by end of week.',
    created_at: '2025-11-06T16:15:00Z',
    reactions: [{ emoji: '🎯', user_ids: ['user-8'] }],
  },
  {
    id: 'comment-9',
    task_id: 'TASK-17',
    author_id: 'user-6',
    content: 'Rate limiting is implemented. Ready for review!',
    created_at: '2025-11-07T13:05:00Z',
    reactions: [{ emoji: '🚀', user_ids: ['user-1', 'user-3'] }],
  },
  {
    id: 'comment-10',
    task_id: 'TASK-20',
    author_id: 'user-5',
    content: 'Working on dark mode designs. Should I create a color system doc?',
    created_at: '2025-11-07T12:10:00Z',
    reactions: [],
  },
  {
    id: 'comment-11',
    task_id: 'TASK-20',
    author_id: 'user-1',
    content: 'Yes please! That would be helpful for the whole team.',
    created_at: '2025-11-07T12:15:00Z',
    parent_id: 'comment-10',
    reactions: [{ emoji: '👍', user_ids: ['user-2'] }],
  },
];

// Mock Repo Requests
export const mockRepoRequests: RepoRequest[] = [
  {
    id: 'req-1',
    project_id: 'proj-1',
    repo_url: 'https://github.com/devize/frontend',
    requested_by: 'user-2',
    status: 'pending',
    created_at: '2025-11-07T10:00:00Z',
  },
  {
    id: 'req-2',
    project_id: 'proj-3',
    repo_url: 'https://github.com/devize/data-pipeline',
    requested_by: 'user-3',
    status: 'approved',
    created_at: '2025-11-05T14:00:00Z',
  },
];

// Helper functions
export function getUserById(userId: string): User | undefined {
  return mockUsers.find((u) => u.id === userId);
}

export function getTasksByProject(projectId: string): Task[] {
  return mockTasks.filter((t) => t.project_id === projectId);
}

export function getTaskById(taskId: string): Task | undefined {
  return mockTasks.find((t) => t.id === taskId);
}

export function getProjectById(projectId: string): Project | undefined {
  return mockProjects.find((p) => p.id === projectId);
}

export function getCommitsByTask(taskId: string): Commit[] {
  return mockCommits.filter((c) => c.task_id === taskId);
}

export function getCommentsByTask(taskId: string): Comment[] {
  return mockComments.filter((c) => c.task_id === taskId);
}

export function getTasksByAssignee(userId: string): Task[] {
  return mockTasks.filter((t) => t.assignees.includes(userId));
}

// Team invite interface and mock data
export interface TeamInvite {
  id: string;
  token: string;
  role: UserRole;
  created_by: string;
  created_at: string;
  expires_at: string;
  projects: string[];
  status: 'pending' | 'accepted' | 'expired';
  used_by?: string;
}

export const mockInvites: TeamInvite[] = [
  {
    id: 'invite-1',
    token: 'abc123xyz',
    role: 'developer',
    created_by: 'user-1',
    created_at: '2025-11-05T10:00:00Z',
    expires_at: '2025-11-12T10:00:00Z',
    projects: ['project-1', 'project-2'],
    status: 'accepted',
    used_by: 'user-2',
  },
  {
    id: 'invite-2',
    token: 'def456uvw',
    role: 'designer',
    created_by: 'user-1',
    created_at: '2025-11-06T14:30:00Z',
    expires_at: '2025-11-13T14:30:00Z',
    projects: ['project-1'],
    status: 'pending',
  },
];

// Add some users with custom roles
mockUsers.push(
  {
    id: 'user-11',
    name: 'Jordan Martinez',
    email: 'jordan@devize.com',
    role: 'analyst',
    customRole: 'Data Analyst',
    points: 750,
  },
  {
    id: 'user-12',
    name: 'Taylor Wong',
    email: 'taylor@devize.com',
    role: 'scrum-master',
    customRole: 'Scrum Master',
  },
  {
    id: 'user-13',
    name: 'Casey Johnson',
    email: 'casey@devize.com',
    role: 'devops',
    customRole: 'DevOps Engineer',
    points: 1425,
  }
);

// Add custom roles to projects
mockProjects[0].customRoles = ['Data Analyst', 'Scrum Master', 'DevOps Engineer'];
mockProjects[0].members.push('user-11', 'user-12', 'user-13');

// Mock Task Files
export const mockTaskFiles: TaskFile[] = [
  {
    id: 'file-1',
    task_id: 'TASK-2',
    filename: 'comment-thread-mockup.fig',
    file_url: 'https://example.com/files/comment-thread-mockup.fig',
    file_type: 'application/figma',
    file_size: 2456789,
    uploaded_by: 'user-5',
    uploaded_at: '2025-11-06T10:30:00Z',
    privacy: 'public',
    description: 'Initial design mockups for threaded comments UI',
  },
  {
    id: 'file-2',
    task_id: 'TASK-2',
    filename: 'design-feedback.png',
    file_url: 'https://example.com/files/design-feedback.png',
    file_type: 'image/png',
    file_size: 1234567,
    uploaded_by: 'user-1',
    uploaded_at: '2025-11-06T11:15:00Z',
    privacy: 'assignees-only',
    description: 'PM feedback on design iterations',
  },
  {
    id: 'file-3',
    task_id: 'TASK-1',
    filename: 'websocket-architecture.pdf',
    file_url: 'https://example.com/files/websocket-architecture.pdf',
    file_type: 'application/pdf',
    file_size: 987654,
    uploaded_by: 'user-2',
    uploaded_at: '2025-11-05T14:00:00Z',
    privacy: 'specific-members',
    allowed_users: ['user-1', 'user-3', 'user-6'],
    description: 'Technical architecture document for WebSocket implementation',
  },
  {
    id: 'file-4',
    task_id: 'TASK-5',
    filename: 'mobile-bug-recording.mp4',
    file_url: 'https://example.com/files/mobile-bug-recording.mp4',
    file_type: 'video/mp4',
    file_size: 15678901,
    uploaded_by: 'user-4',
    uploaded_at: '2025-11-07T09:00:00Z',
    privacy: 'public',
    description: 'Screen recording demonstrating the drag-and-drop issue on mobile',
  },
  {
    id: 'file-5',
    task_id: 'TASK-6',
    filename: 'database-query-analysis.xlsx',
    file_url: 'https://example.com/files/database-query-analysis.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 456789,
    uploaded_by: 'user-11',
    uploaded_at: '2025-11-04T15:30:00Z',
    privacy: 'specific-members',
    allowed_users: ['user-6', 'user-1'],
    description: 'Performance analysis data for slow queries',
  },
  {
    id: 'file-6',
    task_id: 'TASK-10',
    filename: 'export-feature-specs.docx',
    file_url: 'https://example.com/files/export-feature-specs.docx',
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 234567,
    uploaded_by: 'user-1',
    uploaded_at: '2025-11-02T11:00:00Z',
    privacy: 'assignees-only',
    description: 'Detailed requirements for PDF and CSV export functionality',
  },
  {
    id: 'file-7',
    task_id: 'TASK-11',
    filename: 'velocity-chart-reference.png',
    file_url: 'https://example.com/files/velocity-chart-reference.png',
    file_type: 'image/png',
    file_size: 678901,
    uploaded_by: 'user-5',
    uploaded_at: '2025-11-03T10:00:00Z',
    privacy: 'public',
    description: 'Reference designs for velocity chart visualization',
  },
  {
    id: 'file-8',
    task_id: 'TASK-13',
    filename: 'component-api-draft.md',
    file_url: 'https://example.com/files/component-api-draft.md',
    file_type: 'text/markdown',
    file_size: 123456,
    uploaded_by: 'user-5',
    uploaded_at: '2025-11-06T16:30:00Z',
    privacy: 'public',
    description: 'Draft documentation for component APIs',
  },
  {
    id: 'file-9',
    task_id: 'TASK-20',
    filename: 'dark-mode-palette.json',
    file_url: 'https://example.com/files/dark-mode-palette.json',
    file_type: 'application/json',
    file_size: 12345,
    uploaded_by: 'user-5',
    uploaded_at: '2025-11-07T12:30:00Z',
    privacy: 'specific-members',
    allowed_users: ['user-2', 'user-1'],
    description: 'Color tokens for dark mode theme',
  },
  {
    id: 'file-10',
    task_id: 'TASK-7',
    filename: 'fcm-integration-guide.pdf',
    file_url: 'https://example.com/files/fcm-integration-guide.pdf',
    file_type: 'application/pdf',
    file_size: 567890,
    uploaded_by: 'user-2',
    uploaded_at: '2025-11-07T13:00:00Z',
    privacy: 'assignees-only',
    description: 'Step-by-step guide for Firebase Cloud Messaging setup',
  },
];

// Mock Task Completion Analytics
export const mockTaskCompletionAnalytics: TaskCompletionAnalytics[] = [
  {
    task_id: 'TASK-3',
    user_id: 'user-2',
    completion_time_hours: 38.5,
    created_at: '2025-10-20T14:00:00Z',
    completed_at: '2025-11-05T16:45:00Z',
  },
  {
    task_id: 'TASK-9',
    user_id: 'user-2',
    completion_time_hours: 12.25,
    created_at: '2025-10-30T11:00:00Z',
    completed_at: '2025-11-04T16:30:00Z',
  },
  {
    task_id: 'TASK-14',
    user_id: 'user-5',
    completion_time_hours: 48.5,
    created_at: '2025-10-18T09:00:00Z',
    completed_at: '2025-10-28T14:30:00Z',
  },
  {
    task_id: 'TASK-15',
    user_id: 'user-2',
    completion_time_hours: 18.75,
    created_at: '2025-10-15T11:00:00Z',
    completed_at: '2025-10-25T09:20:00Z',
  },
  {
    task_id: 'TASK-16',
    user_id: 'user-3',
    completion_time_hours: 96.25,
    created_at: '2025-10-12T08:00:00Z',
    completed_at: '2025-10-30T17:00:00Z',
  },
];

// Helper functions for files
export function getFilesByTask(taskId: string): TaskFile[] {
  return mockTaskFiles.filter((f) => f.task_id === taskId);
}

export function canUserViewFile(file: TaskFile, userId: string, taskAssignees: string[]): boolean {
  if (file.privacy === 'public') return true;
  if (file.privacy === 'assignees-only') return taskAssignees.includes(userId);
  if (file.privacy === 'specific-members') return file.allowed_users?.includes(userId) || false;
  return false;
}

// Helper to get all unique roles (including custom)
export function getAllRoles(): string[] {
  const standardRoles = ['developer', 'designer', 'qa'];
  const customRoles = mockUsers
    .filter((u) => u.customRole)
    .map((u) => u.customRole as string);
  return [...standardRoles, ...Array.from(new Set(customRoles))];
}

// Helper to get role display name
export function getRoleDisplayName(role: string, customRole?: string): string {
  if (customRole) return customRole;
  const roleMap: Record<string, string> = {
    developer: 'Developer',
    designer: 'Designer',
    qa: 'QA Tester',
    analyst: 'Data Analyst',
    'scrum-master': 'Scrum Master',
    devops: 'DevOps Engineer',
  };
  return roleMap[role] || role;
}