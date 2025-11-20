"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { motion } from 'framer-motion';
import { Mail, Users, User, Clock } from 'lucide-react';
// @ts-ignore - Icons exist at runtime but TypeScript hasn't updated
import { Send, FolderKanban, Inbox } from 'lucide-react';
import { useState, useEffect } from 'react';

type MessageType = 'individual' | 'project_team' | 'broadcast';

interface Project {
  _id: string;
  name: string;
  member_ids?: string[];
}

interface Member {
  _id: string;
  username: string;
  full_name: string;
  email: string;
}

interface Message {
  _id: string;
  sender_id: string;
  subject: string;
  content: string;
  message_type: string;
  created_at: string;
  read?: boolean;
}

interface Sender {
  _id: string;
  full_name: string;
  username: string;
}

export default function MessagesPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState<'send' | 'inbox'>('inbox');
  const [messageType, setMessageType] = useState<MessageType>('broadcast');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Inbox state
  const [messages, setMessages] = useState<Message[]>([]);
  const [senders, setSenders] = useState<{ [key: string]: Sender }>({});
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Helper to extract string ID from MongoDB ObjectId
  const extractId = (id: any): string => {
    if (typeof id === 'string') return id;
    if (id && typeof id === 'object' && '$oid' in id) return id.$oid;
    return String(id);
  };

  useEffect(() => {
    fetchProjects();
    fetchMembers();
    if (user) {
      loadMessages();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5657/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched projects:', data);
        setProjects(data);
      } else {
        console.error('Failed to fetch projects, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5657/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;
      
      const response = await fetch('http://localhost:5657/messages/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: extractId(userId) }),
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
        
        // Fetch sender details
        const uniqueSenderIds = [...new Set(sortedData.map((msg: Message) => extractId(msg.sender_id)))] as string[];
        await fetchSenders(uniqueSenderIds);
        
        if (sortedData.length > 0) {
          setSelectedMessage(sortedData[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoadingMessages(false);
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
          senderMap[senderId] = senderData;
        }
      } catch (error) {
        console.error(`Failed to fetch sender ${senderId}:`, error);
      }
    }
    
    setSenders(senderMap);
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
        return 'Message';
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'Individual':
        return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      case 'ProjectTeam':
        return 'border-purple-500/50 bg-purple-500/10 text-purple-400';
      case 'Broadcast':
        return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400';
      default:
        return 'border-gray-500/50 bg-gray-500/10 text-gray-400';
    }
  };

  const handleSend = async () => {
    if (!subject || !message) {
      toast.warning('Please fill in all fields');
      return;
    }

    if (messageType === 'individual' && selectedMembers.length === 0) {
      toast.warning('Please select at least one member');
      return;
    }

    if (messageType === 'project_team' && !selectedProject) {
      toast.warning('Please select a project');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        subject,
        content: message,
        message_type: messageType,
      };

      if (messageType === 'individual') {
        payload.recipient_ids = selectedMembers;
      } else if (messageType === 'project_team') {
        payload.project_id = selectedProject;
      }

      const response = await fetch('http://localhost:5657/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Message sent successfully');
        setSubject('');
        setMessage('');
        setSelectedMembers([]);
        setSelectedProject('');
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('An error occurred while sending the message');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId: any) => {
    const id = extractId(memberId);
    setSelectedMembers(prev => 
      prev.includes(id)
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-gray-400">Send and manage your messages</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-primary/10">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'inbox'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5" />
              Inbox {messages.length > 0 && `(${messages.length})`}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'send'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Message
            </div>
          </button>
        </div>

        {/* Inbox Tab */}
        {activeTab === 'inbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-xl border border-primary/10 h-[700px] flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
                  <h2 className="text-lg font-bold">Inbox</h2>
                  <span className="ml-auto text-sm text-gray-400">{messages.length}</span>
                </div>

                {loadingMessages ? (
                  <div className="text-center py-8 text-gray-400">Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No messages</div>
                ) : (
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
                )}
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

                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {selectedMessage.content}
                      </div>
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

        {/* Send Tab */}
        {activeTab === 'send' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-xl border border-primary/10 max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">New Message</h2>
              <p className="text-sm text-gray-400">Choose recipients and compose your message</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Message Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Recipient Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setMessageType('individual')}
                  className={`p-4 rounded-lg border transition-all ${
                    messageType === 'individual'
                      ? 'bg-primary/20 border-primary'
                      : 'bg-dark-300/50 border-primary/20 hover:border-primary/50'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Individual Member</div>
                  <div className="text-xs text-gray-400 mt-1">Message specific members</div>
                </button>

                <button
                  onClick={() => setMessageType('project_team')}
                  className={`p-4 rounded-lg border transition-all ${
                    messageType === 'project_team'
                      ? 'bg-primary/20 border-primary'
                      : 'bg-dark-300/50 border-primary/20 hover:border-primary/50'
                  }`}
                >
                  <FolderKanban className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Project Team</div>
                  <div className="text-xs text-gray-400 mt-1">Message all project members</div>
                </button>

                <button
                  onClick={() => setMessageType('broadcast')}
                  className={`p-4 rounded-lg border transition-all ${
                    messageType === 'broadcast'
                      ? 'bg-primary/20 border-primary'
                      : 'bg-dark-300/50 border-primary/20 hover:border-primary/50'
                  }`}
                >
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Broadcast</div>
                  <div className="text-xs text-gray-400 mt-1">Message all members</div>
                </button>
              </div>
            </div>

            {/* Individual Member Selection */}
            {messageType === 'individual' && (
              <div>
                <label className="block text-sm font-medium mb-3">Select Members</label>
                <div className="max-h-60 overflow-y-auto space-y-2 p-4 bg-dark-300/30 rounded-lg border border-primary/10">
                  {members.map((member) => (
                    <label
                      key={extractId(member._id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(extractId(member._id))}
                        onChange={() => toggleMember(member._id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{member.full_name}</div>
                        <div className="text-sm text-gray-400">@{member.username} • {member.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {selectedMembers.length} member(s) selected
                </div>
              </div>
            )}

            {/* Project Team Selection */}
            {messageType === 'project_team' && (
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select Project {projects.length > 0 && `(${projects.length} available)`}
                </label>
                {projects.length === 0 ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
                    No projects available. Please create a project first.
                  </div>
                ) : (
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-300/50 border border-primary/20 rounded-lg focus:border-primary/50 focus:outline-none transition-colors"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={extractId(project._id)} value={extractId(project._id)}>
                        {project.name} ({project.member_ids?.length || 0} members)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Broadcast Info */}
            {messageType === 'broadcast' && (
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Broadcasting to all {members.length} members</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  This message will be sent to every member in the system.
                </p>
              </div>
            )}

            {/* Subject */}
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

            {/* Message */}
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

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
