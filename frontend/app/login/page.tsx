"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'Admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/member');
      }
    }
  }, [user, loading, router]);

  const handleGithubLogin = () => {
    window.location.href = authAPI.githubLogin();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-2">IRIS</h1>
          <p className="text-gray-400">Robotics Club Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-2xl border border-primary/10 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* GitHub Login Button */}
          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-300 text-gray-400">OAuth Authentication</span>
            </div>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-gray-400">
            <p>Login with your GitHub account to access</p>
            <p>the IRIS Robotics Club dashboard</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 IRIS Robotics Club. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}
