"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Award, Plus, Minus, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { usersAPI, coinsAPI } from '@/lib/api';

export default function CoinsPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll(token!);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAwardCoins = async (isPositive: boolean) => {
    if (!selectedUser || !amount || !reason) {
      toast.warning('Please fill in all fields');
      return;
    }

    const coinAmount = isPositive ? parseInt(amount) : -parseInt(amount);
    
    if (isNaN(coinAmount)) {
      toast.warning('Please enter a valid number');
      return;
    }

    setSubmitting(true);

    try {
      // Extract user ID from MongoDB format
      const userId = typeof selectedUser === 'string' ? selectedUser : selectedUser;
      const adminId = typeof user?.id === 'string' ? user.id : (user as any)?._id?.$oid || (user as any)?._id;

      await coinsAPI.manage(token!, {
        user_id: userId,
        amount: coinAmount,
        admin_id: adminId,
        reason: reason
      });

      toast.success(`Successfully ${isPositive ? 'awarded' : 'deducted'} ${Math.abs(coinAmount)} coins!`);
      
      // Reset form
      setSelectedUser('');
      setAmount('');
      setReason('');
      
      // Reload users to show updated coins
      loadUsers();
    } catch (error: any) {
      console.error('Failed to manage coins:', error);
      toast.error(`Failed to update coins: ${error?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Coins Management</h1>
          <p className="text-gray-400">Award or deduct coins from members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Award Coins Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-xl border border-primary/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Manage Coins</h2>
                <p className="text-sm text-gray-400">Award or deduct coins from users</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Select User */}
              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-300/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                  disabled={loading}
                >
                  <option value="">Choose a user...</option>
                  {users.map((u) => {
                    const uid = typeof u._id === 'string' ? u._id : u._id?.$oid;
                    return (
                      <option key={uid} value={uid}>
                        {u.full_name || u.username} ({u.coins || 0} coins)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter coin amount"
                  className="w-full px-4 py-2 bg-dark-300/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                  min="1"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you awarding/deducting coins?"
                  className="w-full px-4 py-2 bg-dark-300/50 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50 h-24 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAwardCoins(true)}
                  disabled={submitting || !selectedUser || !amount || !reason}
                  className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Award Coins
                </button>
                <button
                  onClick={() => handleAwardCoins(false)}
                  disabled={submitting || !selectedUser || !amount || !reason}
                  className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Minus className="w-4 h-4" />
                  Deduct Coins
                </button>
              </div>
            </div>
          </motion.div>

          {/* Users Coin Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-xl border border-primary/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">User Balances</h2>
                <p className="text-sm text-gray-400">Current coin balances</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                </div>
              ) : users.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No users found</p>
              ) : (
                users
                  .sort((a, b) => (b.coins || 0) - (a.coins || 0))
                  .map((u, index) => {
                    const uid = typeof u._id === 'string' ? u._id : u._id?.$oid;
                    return (
                      <div
                        key={uid}
                        className="flex items-center justify-between p-3 rounded-lg bg-dark-300/30 hover:bg-dark-300/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-xs font-bold">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{u.full_name || u.username}</p>
                            <p className="text-xs text-gray-400">@{u.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span className="font-bold text-amber-400">{u.coins || 0}</span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
