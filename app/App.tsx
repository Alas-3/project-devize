'use client'

import { useState } from "react";
import { LandingPage } from "./components/landing/LandingPage";
import { LoginPage } from "./components/auth/LoginPage";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { PMDashboard } from "./components/pm/PMDashboard";
import { DeveloperDashboard } from "./components/developer/DeveloperDashboard";
import { ProjectList } from "./components/projects/ProjectList";
import { ProjectDetail } from "./components/projects/ProjectDetail";
import { TaskDetailPanel } from "./components/tasks/TaskDetailPanel";
import { ActivityFeed } from "./components/activity/ActivityFeed";
import { NewProjectPanel } from "./components/panels/NewProjectPanel";
import { NewTaskPanel } from "./components/panels/NewTaskPanel";
import { ComprehensiveAnalytics } from "./components/analytics/ComprehensiveAnalytics";
import { Leaderboard } from "./components/leaderboard/Leaderboard";
import { SettingsPage } from "./components/settings/SettingsPage";
import { TeamsDashboard } from "./components/teams/TeamsDashboard";
import { User, UserRole, mockUsers } from "./data/mockData";

type View =
  | "dashboard"
  | "projects"
  | "teams"
  | "activity"
  | "analytics"
  | "settings";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [activeView, setActiveView] =
    useState<View>("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | null
  >(null);
  const [selectedTaskId, setSelectedTaskId] = useState<
    string | null
  >(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);

  const handleLogin = (email: string, role: UserRole) => {
    // In a real app, this would authenticate the user
    // For now, find or create a user with this email/role
    const existingUser = mockUsers.find(
      (u) => u.email === email,
    );
    if (existingUser) {
      setCurrentUser(existingUser);
    } else {
      // Create a new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
      };
      setCurrentUser(newUser);
    }
    setShowLanding(false);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView("dashboard");
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    setShowLanding(true);
    setShowLogin(false);
  };

  const handleNavigate = (view: string) => {
    setActiveView(view as View);
    setSelectedProjectId(null);
  };

  const handleNavigateToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveView("projects");
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  if (showLanding && !currentUser) {
    return (
      <LandingPage
        onTryDemo={() => {
          setShowLanding(false);
          setShowLogin(true);
        }}
        onSignUp={() => {
          setShowLanding(false);
          setShowLogin(true);
        }}
      />
    );
  }

  if (showLogin && !currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col">
      {currentUser && (
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          userRole={currentUser?.role || "developer"}
          currentUser={currentUser}
          onLogout={handleLogout}
          onNewProject={
            currentUser?.role === "pm"
              ? () => setShowNewProject(true)
              : undefined
          }
        />
        <main className="flex-1 overflow-hidden flex flex-col w-full lg:w-auto">
          {/* Dashboard View */}
          {activeView === "dashboard" &&
            currentUser.role === "pm" && (
              <PMDashboard
                userId={currentUser.id}
                onNavigateToProject={handleNavigateToProject}
              />
            )}
          {activeView === "dashboard" &&
            currentUser.role === "developer" && (
              <DeveloperDashboard
                userId={currentUser.id}
                onOpenTask={setSelectedTaskId}
              />
            )}
          {activeView === "dashboard" &&
            currentUser.role !== "pm" &&
            currentUser.role !== "developer" && (
              <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
                <div className="text-center">
                  <h2>Welcome to Devize</h2>
                  <p className="text-muted-foreground mt-2">
                    Your dashboard is being prepared
                  </p>
                </div>
              </div>
            )}

          {/* Projects View */}
          {activeView === "projects" && !selectedProjectId && (
            <ProjectList
              userId={currentUser.id}
              onSelectProject={setSelectedProjectId}
            />
          )}
          {activeView === "projects" && selectedProjectId && (
            <ProjectDetail
              projectId={selectedProjectId}
              onBack={handleBackToProjects}
              currentUserId={currentUser.id}
            />
          )}

          {/* Teams View */}
          {activeView === "teams" && (
            <TeamsDashboard
              currentUserId={currentUser.id}
            />
          )}

          {/* Activity View */}
          {activeView === "activity" && (
            <ActivityFeed userId={currentUser.id} />
          )}

          {/* Analytics View (PM only) */}
          {activeView === "analytics" && currentUser.role === "pm" && (
            <ComprehensiveAnalytics userId={currentUser.id} />
          )}
          
          {/* Leaderboard View (Developer only) */}
          {activeView === "analytics" && currentUser.role === "developer" && (
            <Leaderboard userId={currentUser.id} />
          )}

          {/* Settings View */}
          {activeView === "settings" && (
            <SettingsPage currentUser={currentUser} onLogout={handleLogout} />
          )}
        </main>
      </div>

      {/* Global Task Detail Panel (for developer dashboard) */}
      {selectedTaskId && activeView === "dashboard" && (
        <TaskDetailPanel
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          currentUserId={currentUser.id}
        />
      )}

      {/* New Project Panel */}
      {showNewProject && (
        <NewProjectPanel
          onClose={() => setShowNewProject(false)}
          onSubmit={(project) => {
            console.log("New project created:", project);
            setShowNewProject(false);
          }}
          currentUserId={currentUser.id}
        />
      )}

      {/* New Task Panel */}
      {showNewTask && (
        <NewTaskPanel
          onClose={() => setShowNewTask(false)}
          onSubmit={(task) => {
            console.log("New task created:", task);
            setShowNewTask(false);
          }}
          currentUserId={currentUser.id}
        />
      )}
    </div>
  );
}