"use client";

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Coins, 
  MessageSquare, 
  Trophy,
  Home,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';

const adminRoutes = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/admin/users', icon: Users },
  { name: 'Projects', href: '/dashboard/admin/projects', icon: FolderKanban },
  { name: 'Coins', href: '/dashboard/admin/coins', icon: Coins },
  { name: 'Messages', href: '/dashboard/admin/messages', icon: MessageSquare },
];

const memberRoutes = [
  { name: 'Dashboard', href: '/dashboard/member', icon: Home },
  { name: 'My Projects', href: '/dashboard/member/projects', icon: FolderKanban },
  { name: 'Leaderboard', href: '/dashboard/member/leaderboard', icon: Trophy },
  { name: 'Messages', href: '/dashboard/member/messages', icon: MessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = isAdmin ? adminRoutes : memberRoutes;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-100">
      {/* Back to Home Button - Fixed top left (desktop only, hidden on mobile) */}
      <Link
        href="/"
        className="hidden lg:block fixed top-4 left-4 z-50 p-3 rounded-lg bg-dark-300/80 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
      </Link>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-dark-300 border border-primary/20 hover:border-primary/40 transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-dark-300/50 backdrop-blur-xl border-r border-primary/10 flex-col z-30 pt-16">
        {/* Logo */}
        <div className="p-6 border-b border-primary/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-dark text-xl font-bold">I</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">IRIS</h1>
              <p className="text-xs text-gray-400">{isAdmin ? 'Admin' : 'Member'} Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-lg font-bold">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          </div>
          
          {!isAdmin && (
            <div className="mt-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Your Coins</span>
                <span className="text-sm font-bold text-primary flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {user?.coins || 0}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              const Icon = route.icon;
              
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary'
                        : 'hover:bg-dark-300/50 border border-transparent hover:border-primary/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                    <span className="flex-1">{route.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            <span className="text-gray-400 group-hover:text-red-500">Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-dark-300/50 backdrop-blur-xl border-r border-primary/10 z-40 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-primary/10">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-dark text-xl font-bold">I</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">IRIS</h1>
                  <p className="text-xs text-gray-400">{isAdmin ? 'Admin' : 'Member'} Dashboard</p>
                </div>
              </Link>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary text-lg font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
              
              {!isAdmin && (
                <div className="mt-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Your Coins</span>
                    <span className="text-sm font-bold text-primary flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      {user?.coins || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {routes.map((route) => {
                  const isActive = pathname === route.href;
                  const Icon = route.icon;
                  
                  return (
                    <li key={route.href}>
                      <Link
                        href={route.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary'
                            : 'hover:bg-dark-300/50 border border-transparent hover:border-primary/10'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                        <span className="flex-1">{route.name}</span>
                        {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-primary/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                <span className="text-gray-400 group-hover:text-red-500">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen p-6 lg:p-8 pt-20">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
