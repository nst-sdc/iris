"use client";

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, Mail, Github, Zap, Image, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usersAPI, projectsAPI, eventsAPI, galleryAPI } from '@/lib/api';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalCoins: 0,
    totalEvents: 0,
    totalGallery: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token]);

  const loadStats = async () => {
    try {
      const [users, projects, events, gallery] = await Promise.all([
        usersAPI.getAll(token!),
        projectsAPI.getAll(token!),
        eventsAPI.getAll().catch(() => []),
        galleryAPI.getAll().catch(() => []),
      ]);

      const activeProjects = projects.filter((p: any) => p.status?.toLowerCase() === 'active');
      const totalCoins = users.reduce((sum: number, user: any) => sum + (user.coins || 0), 0);

      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        activeProjects: activeProjects.length,
        totalCoins,
        totalEvents: events.length,
        totalGallery: gallery.length,
      });

      // Build recent activity from real data
      const activities: any[] = [];

      // Add recent users (last 5)
      const recentUsers = [...users]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      recentUsers.forEach(user => {
        activities.push({
          type: 'user',
          color: 'bg-green-400',
          text: <><span className="font-semibold">{user.full_name || user.username}</span> joined the club</>,
          time: user.created_at,
        });
      });

      // Add recent projects (last 5)
      const recentProjects = [...projects]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      recentProjects.forEach(project => {
        activities.push({
          type: 'project',
          color: 'bg-blue-400',
          text: <>New project <span className="font-semibold">{project.name}</span> created</>,
          time: project.created_at,
        });
      });

      // Add users with coins
      const usersWithCoins = users
        .filter((u: any) => u.coins > 0)
        .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 2);
      usersWithCoins.forEach((user: any) => {
        activities.push({
          type: 'coins',
          color: 'bg-amber-400',
          text: <>{user.coins} coins earned by <span className="font-semibold">{user.full_name || user.username}</span></>,
          time: user.updated_at,
        });
      });

      // Sort all activities by time and take last 5
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error: any) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'from-cyan-500 to-blue-500', iconColor: 'text-cyan-400' },
    { icon: Calendar, label: 'Total Projects', value: stats.totalProjects, color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-400' },
    { icon: Github, label: 'Active Projects', value: stats.activeProjects, color: 'from-green-500 to-emerald-500', iconColor: 'text-green-400' },
    { icon: CalendarDays, label: 'Total Events', value: stats.totalEvents, color: 'from-rose-500 to-pink-500', iconColor: 'text-rose-400' },
    { icon: Image, label: 'Gallery Photos', value: stats.totalGallery, color: 'from-indigo-500 to-violet-500', iconColor: 'text-indigo-400' },
    { icon: Award, label: 'Total Coins', value: stats.totalCoins, color: 'from-amber-500 to-orange-500', iconColor: 'text-amber-400' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, projects, and club activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-xl transition-opacity" 
                     style={{ backgroundImage: `linear-gradient(to bottom right, ${card.color})` }} />
                <div className="glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{loading ? '...' : card.value}</h3>
                  <p className="text-gray-400 text-sm">{card.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl border border-primary/10"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/dashboard/admin/users"
              className="group p-4 rounded-lg bg-dark-300/30 border border-primary/10 hover:border-primary/30 hover:bg-dark-300/50 transition-all"
            >
              <Users className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="font-semibold mb-1">Manage Users</h3>
              <p className="text-sm text-gray-400">Add, edit or remove users</p>
            </a>
            
            <a
              href="/dashboard/admin/projects"
              className="group p-4 rounded-lg bg-dark-300/30 border border-primary/10 hover:border-primary/30 hover:bg-dark-300/50 transition-all"
            >
              <Calendar className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="font-semibold mb-1">Projects</h3>
              <p className="text-sm text-gray-400">Create and assign projects</p>
            </a>
            
            <a
              href="/dashboard/admin/gallery"
              className="group p-4 rounded-lg bg-dark-300/30 border border-primary/10 hover:border-primary/30 hover:bg-dark-300/50 transition-all"
            >
              <Image className="w-8 h-8 text-indigo-400 mb-2" />
              <h3 className="font-semibold mb-1">Gallery</h3>
              <p className="text-sm text-gray-400">Manage photos & categories</p>
            </a>
            
            <a
              href="/dashboard/admin/events"
              className="group p-4 rounded-lg bg-dark-300/30 border border-primary/10 hover:border-primary/30 hover:bg-dark-300/50 transition-all"
            >
              <CalendarDays className="w-8 h-8 text-rose-400 mb-2" />
              <h3 className="font-semibold mb-1">Events</h3>
              <p className="text-sm text-gray-400">Create and manage events</p>
            </a>

            <a
              href="/dashboard/admin/coins"
              className="group p-4 rounded-lg bg-dark-300/30 border border-primary/10 hover:border-primary/30 hover:bg-dark-300/50 transition-all"
            >
              <Award className="w-8 h-8 text-amber-400 mb-2" />
              <h3 className="font-semibold mb-1">Coin System</h3>
              <p className="text-sm text-gray-400">Manage rewards and coins</p>
            </a>
            
            <a
              href="/dashboard/admin/messages"
              className="group p-4 rounded-lg bg-dark-300/30 border border-primary/10 hover:border-primary/30 hover:bg-dark-300/50 transition-all"
            >
              <Mail className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="font-semibold mb-1">Messages</h3>
              <p className="text-sm text-gray-400">Send announcements</p>
            </a>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl border border-primary/10"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-dark-300/30">
                  <div className={`w-2 h-2 rounded-full ${activity.color} mt-2`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-gray-400">{getTimeAgo(activity.time)}</p>
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
