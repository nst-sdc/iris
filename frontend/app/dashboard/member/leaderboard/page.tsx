"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { coinsAPI } from '@/lib/api';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await coinsAPI.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Award className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Award className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'from-gray-400/20 to-gray-300/20 border-gray-400/30';
      case 3:
        return 'from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default:
        return 'from-primary/10 to-secondary/10 border-primary/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2"><Award className="inline w-10 h-10 text-yellow-400 mr-2" /> Leaderboard</h1>
          <p className="text-gray-400">See your ranking among members</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 glass-card rounded-xl border border-primary/10"
          >
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-gray-400">The leaderboard will appear once members earn coins.</p>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {leaderboard.map((member, index) => {
              const rank = index + 1;
              return (
                <motion.div
                  key={member._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-6 rounded-xl border bg-gradient-to-r ${getRankColor(rank)} hover:border-primary/40 transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary text-lg font-bold">
                        {member.full_name?.charAt(0) || member.username?.charAt(0) || 'U'}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{member.full_name || member.username}</h3>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 text-amber-400">
                        <span className="text-xl">🪙</span>
                        <span className="text-2xl font-bold">{member.coins_earned || member.coins || 0}</span>
                      </div>
                      <p className="text-xs text-gray-400">coins</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
