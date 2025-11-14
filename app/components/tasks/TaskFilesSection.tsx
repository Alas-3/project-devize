'use client'

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Eye,
  EyeOff,
  MoreVertical,
  Trash2,
  Lock,
  Users,
  Globe,
} from 'lucide-react';
import {
  mockTaskFiles,
  getFilesByTask,
  getUserById,
  canUserViewFile,
  mockUsers,
  TaskFile,
  FilePrivacy,
} from '../../data/mockData';
import { toast } from 'sonner';

interface TaskFilesSectionProps {
  taskId: string;
  taskAssignees: string[];
  currentUserId: string;
  projectMembers: string[];
}

export function TaskFilesSection({
  taskId,
  taskAssignees,
  currentUserId,
  projectMembers,
}: TaskFilesSectionProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [filename, setFilename] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [filePrivacy, setFilePrivacy] = useState<FilePrivacy>('public');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const files = getFilesByTask(taskId).filter((file) =>
    canUserViewFile(file, currentUserId, taskAssignees)
  );

  const projectMembersUsers = mockUsers.filter((u) => projectMembers.includes(u.id));

  const handleUpload = () => {
    if (!filename.trim()) {
      toast.error('Please enter a filename');
      return;
    }

    const newFile: TaskFile = {
      id: `file-${Date.now()}`,
      task_id: taskId,
      filename,
      file_url: `https://example.com/files/${filename}`,
      file_type: getFileType(filename),
      file_size: Math.floor(Math.random() * 5000000) + 100000,
      uploaded_by: currentUserId,
      uploaded_at: new Date().toISOString(),
      privacy: filePrivacy,
      allowed_users: filePrivacy === 'specific-members' ? selectedUsers : undefined,
      description: fileDescription,
    };

    console.log('Uploading file:', newFile);
    mockTaskFiles.push(newFile);
    toast.success('File uploaded successfully!');
    setShowUploadDialog(false);
    setFilename('');
    setFileDescription('');
    setFilePrivacy('public');
    setSelectedUsers([]);
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      json: 'application/json',
      md: 'text/markdown',
      txt: 'text/plain',
      fig: 'application/figma',
    };
    return typeMap[ext || ''] || 'application/octet-stream';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getPrivacyIcon = (privacy: FilePrivacy) => {
    if (privacy === 'public') return <Globe className="w-3 h-3" />;
    if (privacy === 'assignees-only') return <Users className="w-3 h-3" />;
    return <Lock className="w-3 h-3" />;
  };

  const getPrivacyLabel = (file: TaskFile) => {
    if (file.privacy === 'public') return 'Everyone';
    if (file.privacy === 'assignees-only') return 'Assignees only';
    if (file.privacy === 'specific-members' && file.allowed_users) {
      return `${file.allowed_users.length} member${file.allowed_users.length === 1 ? '' : 's'}`;
    }
    return 'Private';
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDeleteFile = (fileId: string) => {
    console.log('Deleting file:', fileId);
    toast.success('File deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {files.length} {files.length === 1 ? 'file' : 'files'} attached
          </p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Upload a file and set its visibility permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Filename Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filename</label>
                <Input
                  placeholder="e.g., design-mockup.fig, data-analysis.xlsx"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="Brief description of the file..."
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Privacy Settings */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Visibility</label>
                <Select value={filePrivacy} onValueChange={(v) => setFilePrivacy(v as FilePrivacy)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Everyone on project</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="assignees-only">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Task assignees only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="specific-members">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Specific members</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Members Selection */}
              {filePrivacy === 'specific-members' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Members</label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-auto space-y-2">
                    {projectMembersUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleToggleUser(user.id)}
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleToggleUser(user.id)}
                        />
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <Button onClick={handleUpload} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Files List */}
      <div className="space-y-2">
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No files uploaded yet</p>
          </div>
        ) : (
          files.map((file) => {
            const uploader = getUserById(file.uploaded_by);
            const uploadDate = new Date(file.uploaded_at);
            return (
              <div
                key={file.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                  {getFileIcon(file.file_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{file.filename}</span>
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      {getPrivacyIcon(file.privacy)}
                      {getPrivacyLabel(file)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {file.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>•</span>
                    <span>Uploaded by {uploader?.name}</span>
                    <span>•</span>
                    <span>{uploadDate.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Download className="w-4 h-4" />
                  </Button>
                  {file.uploaded_by === currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteFile(file.id)} className="text-destructive">
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
