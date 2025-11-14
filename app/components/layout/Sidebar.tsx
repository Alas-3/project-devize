'use client'

import { useState } from 'react';
import { Home, Folder, Activity, Settings, BarChart3, Plus, LogOut, Users, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User as UserType } from '../../data/mockData';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userRole: string;
  currentUser: UserType;
  onLogout: () => void;
  onNewProject?: () => void;
  onNewTask?: () => void;
}

export function Sidebar({ 
  activeView, 
  onNavigate, 
  userRole, 
  currentUser,
  onLogout,
  onNewProject, 
  onNewTask 
}: SidebarProps) {
  const [isHoveringAccount, setIsHoveringAccount] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'Projects', icon: Folder },
    ...(userRole === 'pm' 
      ? [{ id: 'teams', label: 'Teams', icon: Users }]
      : []
    ),
    { id: 'activity', label: 'Activity', icon: Activity },
    ...(userRole === 'pm' 
      ? [{ id: 'analytics', label: 'Analytics', icon: BarChart3 }]
      : userRole === 'developer'
      ? [{ id: 'analytics', label: 'Leaderboard', icon: BarChart3 }]
      : []
    ),
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r bg-white flex flex-col fixed lg:sticky top-0 h-screen z-40 transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Account section at the very top */}
        <div className="p-3 sm:p-4 border-b">
          {/* Account section with hover-to-logout */}
          <div
            className="relative"
            onMouseEnter={() => setIsHoveringAccount(true)}
            onMouseLeave={() => setIsHoveringAccount(false)}
          >
            <button
              onClick={isHoveringAccount ? onLogout : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 h-[52px]',
                isHoveringAccount
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer'
                  : 'bg-muted/50 hover:bg-muted cursor-default'
              )}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                {isHoveringAccount ? (
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                    <AvatarFallback className="text-xs">{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="flex-1 text-left flex items-center">
                {isHoveringAccount ? (
                  <div className="text-sm font-medium">Logout</div>
                ) : (
                  <div className="w-full">
                    <div className="text-sm truncate">{currentUser.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{currentUser.role}</div>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions - Only show New Project for PMs, remove New Task from sidebar */}
        {onNewProject && (
          <div className="p-3 sm:p-4 border-b">
            <Button className="w-full justify-start text-sm sm:text-base" size="sm" onClick={() => {
              onNewProject();
              setIsMobileOpen(false);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        )}

        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}