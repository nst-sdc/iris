"use client";

import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Mail, Clock, User, Users } from 'lucide-react';
// @ts-ignore - Icons exist at runtime but TypeScript hasn't updated
import { Inbox, FolderKanban, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface Message {
  _id: string;
  sender_id: string;
  subject: string;
  content: string;
  message_type: string;
  project_id?: string;
  created_at: string;
  read?: boolean;
}

interface Sender {
  _id: string;
  full_name: string;
  username: string;
}

export default function MessagesPage() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [senders, setSenders] = useState<{ [key: string]: Sender }>({});
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (token && user) {
      loadMessages();
    }
  }, [token, user]);

  const loadMessages = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;
      
      const response = await fetch('http://localhost:5657/messages/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Sort: unread first, then by date descending
        const sortedData = data.sort((a: Message, b: Message) => {
          if (a.read === b.read) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.read ? 1 : -1;
        });
        setMessages(sortedData);
        
        // Fetch sender details - extract string IDs from ObjectIds
        const uniqueSenderIds = [...new Set(sortedData.map((msg: Message) => extractId(msg.sender_id)))] as string[];
        await fetchSenders(uniqueSenderIds);
        
        // Auto-select first message if available
        if (sortedData.length > 0) {
          setSelectedMessage(sortedData[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSenders = async (senderIds: string[]) => {
    const senderMap: { [key: string]: Sender } = {};
    
    for (const senderId of senderIds) {
      try {
        const response = await fetch(`http://localhost:5657/users/${senderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const senderData = await response.json();
          // Use the extracted ID as the key
          senderMap[senderId] = senderData;
        }
      } catch (error) {
        console.error(`Failed to fetch sender ${senderId}:`, error);
      }
    }
    
    setSenders(senderMap);
  };

  const handleReply = async () => {
    if (!selectedMessage || !replySubject.trim() || !replyMessage.trim()) {
      showToast('error', 'Please fill in all fields');
      return;
    }

    setSending(true);
    
    const recipientId = extractId(selectedMessage.sender_id);
    console.log('Sending reply to:', recipientId);
    console.log('Token:', token ? 'exists' : 'missing');
    
    try {
      const payload = {
        recipient_ids: [recipientId],
        subject: replySubject,
        content: replyMessage,
        message_type: 'individual',
      };
      
      console.log('Request payload:', payload);
      
      const response = await fetch('http://localhost:5657/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        showToast('success', `Reply sent to ${senders[extractId(selectedMessage.sender_id)]?.full_name || 'recipient'}!`);
        setShowReplyForm(false);
        setReplySubject('');
        setReplyMessage('');
        // Note: Sent messages won't appear in your inbox as you're the sender
      } else {
        const errorText = await response.text();
        console.error('Reply error:', errorText);
        showToast('error', `Failed to send: ${errorText || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Failed to send reply:', error);
      showToast('error', `Error: ${error.message || 'Network error'}`);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to extract string ID from MongoDB ObjectId
  const extractId = (id: any): string => {
    if (typeof id === 'string') return id;
    if (id && typeof id === 'object' && '$oid' in id) return id.$oid;
    return String(id);
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'Individual':
        return <User className="w-4 h-4" />;
      case 'ProjectTeam':
        return <FolderKanban className="w-4 h-4" />;
      case 'Broadcast':
        return <Users className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'Individual':
        return 'Personal';
      case 'ProjectTeam':
        return 'Project Team';
      case 'Broadcast':
        return 'Broadcast';
      default:
        return type;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'Individual':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ProjectTeam':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Broadcast':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Messages</h1>
          <p className="text-gray-400">View messages from administrators</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-xl border border-primary/10 h-[700px] flex flex-col overflow-hidden"
              >
                <div className="flex items-center gap-2 p-6 pb-4 flex-shrink-0">
                  <Inbox className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold">Inbox</h2>
                  <span className="ml-auto text-sm text-gray-400">{messages.length}</span>
                </div>

                <div 
                  className="flex-1 overflow-y-scroll px-6 pb-6"
                  onWheel={(e) => {
                    e.currentTarget.scrollTop += e.deltaY;
                  }}
                  style={{ 
                    overscrollBehavior: 'contain',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(31, 41, 55, 0.3)'
                  }}
                >
                  <div className="space-y-2">
                  {messages.map((message) => (
                      <button
                        key={extractId(message._id)}
                        onClick={() => setSelectedMessage(message)}
                        className={`w-full text-left p-4 rounded-lg transition-all relative ${
                          extractId(selectedMessage?._id) === extractId(message._id)
                            ? 'bg-primary/20 border border-primary'
                            : message.read === false
                            ? 'bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/15'
                            : 'bg-dark-300/30 border border-transparent hover:bg-dark-300/50'
                        }`}
                      >
                        {message.read === false && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-sm line-clamp-1 flex-1">
                          {message.subject}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ml-2 ${getMessageTypeColor(message.message_type)}`}>
                          {getMessageTypeIcon(message.message_type)}
                          {getMessageTypeLabel(message.message_type)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mb-2 line-clamp-1">
                        {senders[extractId(message.sender_id)]?.full_name || 'Loading...'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(message.created_at)}
                      </div>
                    </button>
                  ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Message Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-8 rounded-xl border border-primary/10 min-h-[600px]"
              >
                {selectedMessage ? (
                  <div className="space-y-6">
                    {/* Message Header */}
                    <div className="border-b border-primary/10 pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-2xl font-bold flex-1">{selectedMessage.subject}</h2>
                        <span className={`text-sm px-3 py-1.5 rounded border flex items-center gap-2 ${getMessageTypeColor(selectedMessage.message_type)}`}>
                          {getMessageTypeIcon(selectedMessage.message_type)}
                          {getMessageTypeLabel(selectedMessage.message_type)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>From: {senders[extractId(selectedMessage.sender_id)]?.full_name || 'Loading...'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(selectedMessage.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {selectedMessage.content}
                      </div>
                    </div>

                    {/* Reply Section */}
                    <div className="mt-8 pt-6 border-t border-primary/10">
                      {!showReplyForm ? (
                        <button
                          onClick={() => {
                            setShowReplyForm(true);
                            setReplySubject(`Re: ${selectedMessage.subject}`);
                          }}
                          className="flex items-center gap-2 px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary rounded-lg transition-all"
                        >
                          <Send className="w-4 h-4" />
                          Reply to this message
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Reply to {senders[extractId(selectedMessage.sender_id)]?.full_name}</h3>
                            <button
                              onClick={() => {
                                setShowReplyForm(false);
                                setReplySubject('');
                                setReplyMessage('');
                              }}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Subject</label>
                            <input
                              type="text"
                              value={replySubject}
                              onChange={(e) => setReplySubject(e.target.value)}
                              className="w-full px-4 py-3 bg-dark-300/50 border border-primary/20 rounded-lg focus:border-primary/50 focus:outline-none transition-colors"
                              placeholder="Reply subject..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <textarea
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              rows={6}
                              className="w-full px-4 py-3 bg-dark-300/50 border border-primary/20 rounded-lg focus:border-primary/50 focus:outline-none transition-colors resize-none"
                              placeholder="Type your reply..."
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={handleReply}
                              disabled={sending || !replySubject.trim() || !replyMessage.trim()}
                              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all font-medium"
                            >
                              <Send className="w-4 h-4" />
                              {sending ? 'Sending...' : 'Send Reply'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Mail className="w-16 h-16 mb-4 text-gray-500" />
                    <p className="text-lg">Select a message to read</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
