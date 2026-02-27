"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { motion } from 'framer-motion';
import { Users, Mail, Award, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usersAPI } from '@/lib/api';

export default function UsersPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (token) {
      loadUsers();
    } else {
      setLoading(false);
      setError('No authentication token found. Please log in again.');
    }
  }, [token]);

  const loadUsers = async () => {
    try {
      console.log('Loading users with token:', token ? 'Token exists' : 'No token');
      const data = await usersAPI.getAll(token!);
      console.log('Users loaded:', data);
      setUsers(data);
      setError(null);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      const errorMessage = error?.message || 'Failed to load users';
      setError(errorMessage + ' - Please try logging out and logging back in.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'Admin' ? 'Member' : 'Admin';
    const confirmMessage = newRole === 'Admin' 
      ? 'Are you sure you want to promote this user to Admin?' 
      : 'Are you sure you want to demote this admin to Member?';
    
    setConfirmDialog({
      isOpen: true,
      title: 'Change User Role',
      message: confirmMessage,
      onConfirm: async () => {
        try {
          const response = await usersAPI.updateRole(token!, { user_id: userId, role: newRole });
          
          // Update local state - handle both plain string and $oid object format
          setUsers(users.map(u => {
            const uid = typeof u._id === 'string' ? u._id : u._id?.$oid;
            return uid === userId ? { ...u, role: newRole } : u;
          }));
          toast.success(`User role updated to ${newRole} successfully!`);
          
          // Reload users to get fresh data from server
          loadUsers();
        } catch (error: any) {
          console.error('Failed to update role:', error);
          toast.error(`Failed to update user role: ${error?.message || 'Unknown error'}`);
        }
      },
    });
  };

  const getRoleBadge = (role: string) => {
    return role === 'Admin'
      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete User',
      message: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await usersAPI.delete(token!, { user_id: userId });
          toast.success('User deleted successfully!');
          loadUsers();
        } catch (err: any) {
          console.error('Failed to delete user:', err);
          toast.error(`Failed to delete user: ${err?.message || 'Unknown error'}`);
        }
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Users Management</h1>
          <p className="text-gray-400">Manage all club members</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 glass-card rounded-xl border border-red-500/30 bg-red-500/5"
          >
            <Users className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-400">Error Loading Users</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={loadUsers}
              className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 glass-card rounded-xl border border-primary/10"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
            <p className="text-gray-400">Start by adding your first member.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.map((user, index) => {
              // Extract actual ID string from MongoDB $oid format or use as-is
              const userId = typeof user._id === 'string' ? user._id : user._id?.$oid || user._id;
              
              return (
              <motion.div
                key={userId || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-2xl font-bold">
                      {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{user.full_name || user.username}</h3>
                        <p className="text-sm text-gray-400">@{user.username}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Award className="w-4 h-4" />
                        <span>{user.coins || 0} coins</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => handleRoleChange(userId, user.role)}
                        className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        {user.role === 'Admin' ? 'Demote to Member' : 'Promote to Admin'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(userId, user.full_name || user.username)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          type="warning"
        />


      </div>
    </DashboardLayout>
  );
}
