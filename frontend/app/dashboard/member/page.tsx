"use client";

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Calendar, Github, Award, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectsAPI, coinsAPI, messagesAPI } from '@/lib/api';

export default function MemberDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    myProjects: 0,
    coins: user?.coins || 0,
    rank: '-',
    newMessages: 0,
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      loadStats();
    }
  }, [token, user]);

  const loadStats = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }

      const [projectsData, messages] = await Promise.all([
        projectsAPI.getUser(token!, userId),
        messagesAPI.getUser(token!, userId),
      ]);

      setProjects(projectsData.slice(0, 3)); // Get only first 3 for recent projects
      setStats({
        myProjects: projectsData.length,
        coins: user?.coins || 0,
        rank: '-',
        newMessages: messages.filter((m: any) => !m.read).length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'on hold':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const statCards = [
    { icon: Calendar, label: 'My Projects', value: stats.myProjects, color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'My Coins', value: stats.coins, color: 'from-amber-500 to-orange-500' },
    { icon: Github, label: 'My Rank', value: stats.rank, color: 'from-green-500 to-emerald-500' },
    { icon: Mail, label: 'New Messages', value: stats.newMessages, color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="gradient-text">{user?.full_name}</span>!</h1>
          <p className="text-gray-400">Here's what's happening with your projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} opacity-20 flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{loading ? '...' : card.value}</h3>
                <p className="text-gray-400 text-sm">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <a
            href="/dashboard/member/projects"
            className="group glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all"
          >
            <Calendar className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">My Projects</h3>
            <p className="text-gray-400 text-sm">View and manage your assigned projects</p>
          </a>

          <a
            href="/dashboard/member/leaderboard"
            className="group glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all"
          >
            <Github className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
            <p className="text-gray-400 text-sm">See your ranking among members</p>
          </a>

          <a
            href="/dashboard/member/messages"
            className="group glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all"
          >
            <Mail className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Messages</h3>
            <p className="text-gray-400 text-sm">Check announcements and updates</p>
          </a>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl border border-primary/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Recent Projects</h2>
            {projects.length > 0 && (
              <a href="/dashboard/member/projects" className="text-primary hover:text-primary/80 text-sm">
                View All →
              </a>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">No projects assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={project._id || index} className="p-4 rounded-lg bg-dark-300/30 border border-primary/10 hover:border-primary/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{project.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        {project.updated_at && (
                          <span className="text-xs text-gray-400">
                            Updated {new Date(project.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        title="View on GitHub"
                      >
                        <Github className="w-5 h-5 text-gray-400 hover:text-primary" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
