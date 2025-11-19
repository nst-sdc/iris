"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { useState } from 'react';

export default function MessagesPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // TODO: Implement message sending
    console.log('Sending message:', { subject, message });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Send Messages</h1>
          <p className="text-gray-400">Broadcast announcements to all members</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-xl border border-primary/10 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">New Announcement</h2>
              <p className="text-sm text-gray-400">Send a message to all members</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject"
                className="w-full px-4 py-3 bg-dark-300/50 border border-primary/20 rounded-lg focus:border-primary/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={8}
                className="w-full px-4 py-3 bg-dark-300/50 border border-primary/20 rounded-lg focus:border-primary/50 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message to All Members
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
