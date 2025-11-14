'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Users,
  UserPlus,
  Link as LinkIcon,
  Copy,
  Check,
  MoreVertical,
  Mail,
  Trash2,
  FolderOpen,
  Shield,
  Plus,
} from 'lucide-react';
import { mockUsers, mockProjects, User, UserRole, getRoleDisplayName } from '../../data/mockData';
import { toast } from 'sonner';

interface TeamsDashboardProps {
  currentUserId: string;
}

export function TeamsDashboard({ currentUserId }: TeamsDashboardProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteRole, setInviteRole] = useState<string>('developer');
  const [customRoleName, setCustomRoleName] = useState('');
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);
  const [inviteProjects, setInviteProjects] = useState<string[]>([]);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);

  // Filter out PMs from team members list (they manage themselves)
  const teamMembers = mockUsers.filter((u) => u.role !== 'pm');
  const allProjects = mockProjects;

  // Get all unique roles including custom ones
  const allRoles = useMemo(() => {
    const standardRoles = [
      { value: 'developer', label: 'Developer' },
      { value: 'designer', label: 'Designer' },
      { value: 'qa', label: 'QA Tester' },
    ];
    
    const customRoles = Array.from(new Set(
      teamMembers
        .filter((u) => u.customRole)
        .map((u) => u.customRole as string)
    )).map((role) => ({
      value: role.toLowerCase().replace(/\s+/g, '-'),
      label: role,
    }));

    return [...standardRoles, ...customRoles];
  }, [teamMembers]);

  // Get role statistics with dynamic counts
  const roleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    teamMembers.forEach((member) => {
      const roleKey = member.customRole || getRoleDisplayName(member.role);
      stats[roleKey] = (stats[roleKey] || 0) + 1;
    });

    return Object.entries(stats).map(([role, count]) => ({ role, count }));
  }, [teamMembers]);

  const generateInviteLink = () => {
    const finalRole = showCustomRoleInput ? customRoleName : inviteRole;
    if (showCustomRoleInput && !customRoleName.trim()) {
      toast.error('Please enter a custom role name');
      return;
    }
    
    const token = Math.random().toString(36).substring(2, 15);
    const link = `https://devize.app/invite/${token}?role=${finalRole}&projects=${inviteProjects.join(',')}`;
    setGeneratedLink(link);
    toast.success('Invite link generated!');
  };

  const copyInviteLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopiedLink(true);
      toast.success('Invite link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleToggleProject = (projectId: string) => {
    setInviteProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleRemoveMember = (userId: string) => {
    toast.success(`Member removed from team`);
    console.log('Remove member:', userId);
  };

  const getMemberProjects = (userId: string) => {
    return allProjects.filter((p) => p.members.includes(userId));
  };

  const handleViewMemberDetails = (user: User) => {
    setSelectedMember(user);
    setShowMemberDialog(true);
  };

  const getRoleColor = (role: string, customRole?: string) => {
    if (customRole) {
      // Generate consistent color based on custom role name
      const hash = customRole.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const colors = [
        'bg-violet-100 text-violet-700',
        'bg-cyan-100 text-cyan-700',
        'bg-amber-100 text-amber-700',
        'bg-rose-100 text-rose-700',
        'bg-teal-100 text-teal-700',
      ];
      return colors[hash % colors.length];
    }
    
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      pm: 'bg-blue-100 text-blue-700',
      developer: 'bg-green-100 text-green-700',
      qa: 'bg-orange-100 text-orange-700',
      designer: 'bg-pink-100 text-pink-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleIcon = (role: string) => {
    if (role === 'admin' || role === 'pm') return <Shield className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="flex-1 overflow-auto bg-muted/30">
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl">Team Management</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Manage your team members, send invites, and assign projects
            </p>
          </div>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setGeneratedLink(null);
                setShowCustomRoleInput(false);
                setCustomRoleName('');
              }} className="w-full sm:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invite New Team Member</DialogTitle>
                <DialogDescription>
                  Generate a unique invite link for a new team member. Only users with an invite link
                  can create accounts.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  {!showCustomRoleInput ? (
                    <div className="flex gap-2">
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() => setShowCustomRoleInput(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Custom
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter custom role name (e.g., 'Data Analyst')"
                        value={customRoleName}
                        onChange={(e) => setCustomRoleName(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowCustomRoleInput(false);
                          setCustomRoleName('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {/* Project Assignment */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign to Projects (Optional)</label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-auto space-y-2">
                    {allProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleToggleProject(project.id)}
                      >
                        <Checkbox
                          checked={inviteProjects.includes(project.id)}
                          onCheckedChange={() => handleToggleProject(project.id)}
                        />
                        <FolderOpen className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm">{project.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {project.members.length} members
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can assign projects now or later
                  </p>
                </div>

                {/* Generate Link */}
                <Button onClick={generateInviteLink} className="w-full">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Generate Invite Link
                </Button>

                {/* Generated Link */}
                {generatedLink && (
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Invite link generated!</span>
                    </div>
                    <div className="flex gap-2">
                      <Input value={generatedLink} readOnly className="text-xs" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyInviteLink}
                        className={copiedLink ? 'bg-green-50' : ''}
                      >
                        {copiedLink ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Share this link with the new team member. The link will expire in 7 days and
                        can only be used once.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dynamic Stats Cards */}
        <div className={`grid gap-4 ${roleStats.length <= 4 ? `grid-cols-${roleStats.length}` : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">Active team members</p>
            </CardContent>
          </Card>
          {roleStats.map(({ role, count }) => (
            <Card key={role}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{role}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{count}</div>
                <p className="text-xs text-muted-foreground">
                  {count === 1 ? 'member' : 'members'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage team member assignments and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member) => {
                const memberProjects = getMemberProjects(member.id);
                const displayRole = member.customRole || getRoleDisplayName(member.role);
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        <Badge className={getRoleColor(member.role, member.customRole)}>
                          {getRoleIcon(member.role)}
                          <span className={getRoleIcon(member.role) ? 'ml-1' : ''}>
                            {displayRole.toUpperCase()}
                          </span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{member.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <FolderOpen className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {memberProjects.length} {memberProjects.length === 1 ? 'project' : 'projects'}
                        </span>
                        {memberProjects.length > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <div className="flex gap-1">
                              {memberProjects.slice(0, 2).map((project) => (
                                <Badge key={project.id} variant="secondary" className="text-xs">
                                  {project.name}
                                </Badge>
                              ))}
                              {memberProjects.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{memberProjects.length - 2}
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMemberDetails(member)}
                      >
                        Manage
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMemberDetails(member)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveMember(member.id)} className="text-destructive">
                            <Trash2 className="w-3 h-3 mr-2" />
                            Remove from Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Member Details Dialog */}
        {selectedMember && (
          <MemberDetailsDialog
            member={selectedMember}
            projects={allProjects}
            allRoles={allRoles}
            open={showMemberDialog}
            onClose={() => setShowMemberDialog(false)}
          />
        )}
      </div>
    </div>
  );
}

interface MemberDetailsDialogProps {
  member: User;
  projects: typeof mockProjects;
  allRoles: { value: string; label: string }[];
  open: boolean;
  onClose: () => void;
}

function MemberDetailsDialog({ member, projects, allRoles, open, onClose }: MemberDetailsDialogProps) {
  const [assignedProjects, setAssignedProjects] = useState<string[]>(
    projects.filter((p) => p.members.includes(member.id)).map((p) => p.id)
  );
  const [memberRole, setMemberRole] = useState(member.role);
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(!!member.customRole);
  const [customRoleName, setCustomRoleName] = useState(member.customRole || '');

  const handleToggleProject = (projectId: string) => {
    setAssignedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSave = () => {
    console.log('Updating member:', member.id, {
      projects: assignedProjects,
      role: showCustomRoleInput ? customRoleName : memberRole,
    });
    toast.success('Member assignments and role updated!');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage {member.name}</DialogTitle>
          <DialogDescription>Update project assignments, role, and permissions</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Member Info */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{member.name}</div>
              <div className="text-sm text-muted-foreground">{member.email}</div>
            </div>
          </div>

          <Separator />

          {/* Role Management */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            {!showCustomRoleInput ? (
              <div className="flex gap-2">
                <Select value={memberRole} onValueChange={setMemberRole}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomRoleInput(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Custom
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Enter custom role name"
                  value={customRoleName}
                  onChange={(e) => setCustomRoleName(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCustomRoleInput(false);
                    setCustomRoleName('');
                  }}
                >
                  Use Standard Role
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Project Assignments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Assignments</label>
            <div className="border rounded-lg p-3 max-h-64 overflow-auto space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleToggleProject(project.id)}
                >
                  <Checkbox
                    checked={assignedProjects.includes(project.id)}
                    onCheckedChange={() => handleToggleProject(project.id)}
                  />
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}