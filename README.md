
# DevSync Product Roadmap

This is a Next.js project for Devize.
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

## Features

- **Project Management Dashboard** - Track projects and tasks
- **Role-based Access** - PM and Developer views
- **Analytics Dashboard** - Comprehensive project analytics
- **Team Management** - Manage team members and roles
- **Real-time Activity Feed** - Track all project activities
- **Task Management** - Kanban board and detailed task views  