'use client'

import { Button } from '../ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, GitBranch, MessageSquare } from 'lucide-react';
import { useRef } from 'react';

interface LandingPageProps {
  onTryDemo: () => void;
  onSignUp: () => void;
}

export function LandingPage({ onTryDemo, onSignUp }: LandingPageProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
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
            <span className="text-lg sm:text-xl">Devize</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" onClick={onTryDemo} size="sm" className="text-xs sm:text-sm">
              Try Demo
            </Button>
            <Button onClick={onSignUp} size="sm" className="text-xs sm:text-sm">Sign Up</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
              <Zap className="w-4 h-4" />
              <span>Where Code Meets Context</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            style={{ lineHeight: 1.1 }}
          >
            Bridge Your Team's
            <br />
            Workflow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Devize synchronizes GitHub commits, task management, and team discussions
            in one unified workspace. Stop losing context between tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Button size="lg" className="text-lg px-8 py-6" onClick={onTryDemo}>
              Try Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={onSignUp}>
              Sign Up Free
            </Button>
          </motion.div>
        </motion.div>

        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground">
              A glimpse of your unified workspace
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-1" />
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="aspect-video bg-slate-50 flex relative overflow-hidden">
                {/* Actual Dashboard UI Representation */}
                <div className="absolute inset-0 flex">
                  {/* Sidebar */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="w-56 bg-slate-900 text-white p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
                      <span className="text-lg font-semibold">Devize</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {['Dashboard', 'Projects', 'Teams', 'Activity', 'Analytics'].map((item, i) => (
                        <div
                          key={item}
                          className={`px-3 py-2 rounded-lg ${i === 0 ? 'bg-blue-600' : 'text-slate-400 hover:bg-slate-800'}`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Top Navbar */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="h-14 bg-white border-b flex items-center justify-between px-6"
                    >
                      <div className="text-lg font-semibold">Dashboard</div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full" />
                      </div>
                    </motion.div>

                    {/* Dashboard Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      viewport={{ once: true }}
                      className="flex-1 p-6 overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-4 h-full">
                        {/* Stats Cards */}
                        <div className="col-span-3 grid grid-cols-3 gap-4 h-24">
                          {[
                            { label: 'Active Projects', value: '12', color: 'blue' },
                            { label: 'Tasks Completed', value: '48', color: 'green' },
                            { label: 'Team Members', value: '8', color: 'purple' }
                          ].map((stat) => (
                            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-4 border">
                              <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                              <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Recent Projects */}
                        <div className="col-span-2 bg-white rounded-lg shadow-sm border p-4">
                          <div className="text-sm font-semibold mb-3">Recent Projects</div>
                          <div className="space-y-2">
                            {[
                              { name: 'Mobile App Redesign', progress: 75, status: 'In Progress' },
                              { name: 'API Integration', progress: 90, status: 'Review' },
                              { name: 'Dashboard Analytics', progress: 45, status: 'In Progress' }
                            ].map((project, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium">{project.name}</div>
                                  <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${project.progress}%` }} />
                                  </div>
                                </div>
                                <div className="text-xs text-slate-500">{project.status}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                          <div className="text-sm font-semibold mb-3">Recent Activity</div>
                          <div className="space-y-3">
                            {[
                              { user: 'JD', action: 'Committed to main', time: '2m ago' },
                              { user: 'AS', action: 'Completed task', time: '15m ago' },
                              { user: 'MK', action: 'Added comment', time: '1h ago' }
                            ].map((activity, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                  {activity.user}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs">{activity.action}</div>
                                  <div className="text-xs text-slate-400">{activity.time}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">
              Built for modern development teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GitBranch,
                title: 'Linked Commits',
                description:
                  'Automatically connect GitHub commits to tasks. See what code changed and why.',
                delay: 0,
              },
              {
                icon: MessageSquare,
                title: 'Team Discussions',
                description:
                  'Threaded comments with mentions and reactions. Keep conversations contextual.',
                delay: 0.1,
              },
              {
                icon: Users,
                title: 'Role-Based Views',
                description:
                  'Customized dashboards for PMs and developers. See what matters to you.',
                delay: 0.2,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Ready to sync your team?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join teams who&apos;ve stopped losing context between tools
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={onTryDemo}
            >
              Try Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-slate-50"
              onClick={onSignUp}
            >
              Start Free
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
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
            <span>Devize</span>
          </div>
          <p className="text-sm">© 2025 Devize. Where code meets context.</p>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}