'use client'

import { Bell, Search, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { User } from '../../data/mockData';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
}

export function Navbar({ currentUser, onLogout }: NavbarProps) {
  const notifications = 5;

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 h-14 sm:h-16">
        {/* Spacer for mobile hamburger menu - only on mobile */}
        <div className="lg:hidden w-9" />
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="font-semibold text-sm sm:text-base">Devize</span>
        </div>

        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tasks, commits, or discussions..."
              className="pl-8 sm:pl-9 bg-slate-50 h-9 sm:h-10 text-sm border-slate-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Spacer for desktop */}
        <div className="md:hidden flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative w-9 h-9 sm:w-10 sm:h-10 hover:bg-slate-100">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {notifications > 0 && (
              <Badge
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-white shadow-md animate-pulse"
              >
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}