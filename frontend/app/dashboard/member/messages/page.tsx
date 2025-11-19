"use client";

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Mail, Clock, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { messagesAPI } from '@/lib/api';

export default function MessagesPage() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      loadMessages();
    }
  }, [token, user]);

  const loadMessages = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;
      
      const data = await messagesAPI.getUser(token!, userId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-gray-400">Check announcements and updates</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 glass-card rounded-xl border border-primary/10"
          >
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Messages</h3>
            <p className="text-gray-400">You don't have any messages yet.</p>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card p-6 rounded-xl border transition-all ${
                  message.read
                    ? 'border-primary/10 opacity-70'
                    : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold">{message.subject || 'No Subject'}</h3>
                      {!message.read && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 flex-shrink-0">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                      {message.message || message.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {message.sender && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>From: {message.sender}</span>
                        </div>
                      )}
                      {message.created_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(message.created_at).toLocaleDateString()} at {new Date(message.created_at).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
