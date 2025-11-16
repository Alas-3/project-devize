# Devize

**Devize** is a modern project management and collaboration platform designed for development teams. Built with Next.js 15 and a focus on intuitive UI/UX, Devize streamlines project tracking, team collaboration, and performance analytics.
## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── globals.css         # Global styles
├── components/         # React components
│   ├── activity/
│   ├── analytics/
│   ├── auth/
│   ├── comments/
│   ├── commits/
│   ├── developer/
│   ├── figma/
│   ├── landing/
│   ├── layout/
│   ├── leaderboard/
│   ├── panels/
│   ├── pm/
│   ├── projects/
│   ├── settings/
│   ├── tasks/
│   ├── teams/
│   └── ui/            # Reusable UI components
├── data/              # Mock data
├── lib/               # Utility functions
└── App.tsx            # Main app component
```

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Current Features

- **🎨 Modern UI/UX** - Clean, minimalist design with thoughtful interactions
- **👥 Role-based Access** - Separate dashboards for Project Managers and Developers
- **📊 Project Management** - Track projects, tasks, and milestones
- **📈 Analytics Dashboard** - Team performance metrics and task analytics
- **👨‍💼 Team Management** - Manage team members and assignments
- **📋 Kanban Board** - Visual task management with drag-and-drop
- **🔔 Activity Feed** - Real-time updates on project activities
- **🏆 Leaderboard** - Developer performance tracking and gamification

## Development Status

**Current Phase: UI/UX Refinement** 🎨

We are actively refining the frontend to achieve a polished, professional, and user-friendly interface. Focus areas include:
- Component styling and consistency
- Navigation and active states
- Hover effects and micro-interactions
- Color contrast and accessibility
- Responsive design optimization

## Roadmap

### Phase 1: UI/UX Polish (Current) ✨
- [x] Migrate from Vite to Next.js 15
- [x] Enhance button and card components with better contrast
- [x] Improve navigation with active states
- [x] Refine analytics tabs with minimalist design
- [ ] Polish all form inputs and interactions
- [ ] Enhance mobile responsiveness
- [ ] Implement consistent design system
- [ ] Add loading states and skeleton screens
- [ ] Improve error handling UI

### Phase 2: Backend Integration 🔧
- [ ] Set up database (PostgreSQL/MongoDB)
- [ ] Implement authentication system (NextAuth.js)
- [ ] Create API routes for CRUD operations
- [ ] Real-time updates with WebSockets
- [ ] File upload and storage integration
- [ ] Email notifications system

### Phase 3: Core Features 🚀
- [ ] GitHub/GitLab integration
- [ ] Code review workflows
- [ ] Sprint planning tools
- [ ] Time tracking functionality
- [ ] Advanced search and filters
- [ ] Commenting and mentions system
- [ ] Task dependencies and relationships

### Phase 4: Advanced Features 📱
- [ ] Figma integration enhancements
- [ ] AI-powered insights and suggestions
- [ ] Custom workflows and automation
- [ ] Reporting and export tools
- [ ] Mobile app (React Native)
- [ ] Third-party integrations (Slack, Jira, etc.)

### Phase 5: Enterprise & Scale 🏢
- [ ] Multi-organization support
- [ ] Advanced permissions and roles
- [ ] Audit logs and compliance
- [ ] White-labeling options
- [ ] Performance optimization at scale
- [ ] Advanced security features