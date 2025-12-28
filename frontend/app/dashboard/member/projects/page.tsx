"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { ProjectFiles } from '@/components/project-files';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Github, Clock, Mail, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectsAPI, usersAPI } from '@/lib/api';

interface JoinRequest {
  _id: string | { $oid: string };
  project_id: string | { $oid: string };
  user_id: string | { $oid: string };
  message: string;
  status: string;
  created_at: string;
  user: {
    _id: string | { $oid: string };
    username: string;
    full_name: string;
    email: string;
  };
}

export default function MemberProjectsPage() {
  const { user, token } = useAuth();
  const toast = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinRequests, setJoinRequests] = useState<{ [key: string]: any[] }>({});
  const [loadingRequests, setLoadingRequests] = useState<{ [key: string]: boolean }>({});
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const [userCache, setUserCache] = useState<{ [key: string]: any }>({});
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
    if (token && user) {
      loadProjects();
    }
  }, [user, token]);

  // Fetch user details by ID
  const fetchUserDetails = async (userId: string) => {
    if (userCache[userId]) {
      return userCache[userId];
    }

    try {
      // Try to get from backend
      const response = await fetch(`http://localhost:5657/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserCache(prev => ({ ...prev, [userId]: userData }));
        return userData;
      }
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
    }

    return null;
  };

  const loadProjects = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId || !token) return;
      
      const data = await projectsAPI.getAll(token);
      const userIdStr = extractId(userId);
      
      // Filter to only show projects where user is lead or member
      const userProjects = data.filter((p: any) => {
        const leadId = p.project_lead_id;
        const leadIdStr = extractId(leadId);
        const isLead = leadIdStr === userIdStr;
        
        // Check if user is a member
        const memberIds = (p.member_ids || []).map((id: any) => extractId(id));
        const isMember = memberIds.includes(userIdStr);
        
        return isLead || isMember;
      });
      
      setProjects(userProjects);
      
      // Load join requests for projects where user is the lead (this will populate userCache)
      const ledProjects = userProjects.filter((p: any) => {
        const leadId = p.project_lead_id;
        const leadIdStr = extractId(leadId);
        return leadIdStr === userIdStr;
      });
      
      for (const project of ledProjects) {
        const projectId = extractId(project._id || project.id);
        await loadJoinRequests(projectId);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJoinRequests = async (projectId: string) => {
    if (!token) return;
    
    const pid = typeof projectId === 'string' ? projectId : (projectId as any).$oid;
    setLoadingRequests(prev => ({ ...prev, [pid]: true }));
    
    try {
      const requests = await projectsAPI.getJoinRequests(token, pid);
      setJoinRequests(prev => ({ ...prev, [pid]: requests }));
      
      // Cache user details from join requests
      requests.forEach((req: any) => {
        if (req.user_id && req.full_name) {
          const userId = extractId(req.user_id);
          setUserCache(prev => ({
            ...prev,
            [userId]: {
              id: userId,
              full_name: req.full_name,
              username: req.username,
              email: req.email
            }
          }));
        }
      });
    } catch (error) {
      console.error(`Failed to load join requests for project ${pid}:`, error);
    } finally {
      setLoadingRequests(prev => ({ ...prev, [pid]: false }));
    }
  };

  const handleJoinRequest = async (requestId: string, status: 'approved' | 'rejected', projectId: string) => {
    if (!token) return;
    
    const rid = typeof requestId === 'string' ? requestId : (requestId as any).$oid;
    setProcessingRequest(rid);
    
    try {
      await projectsAPI.updateJoinRequest(token, rid, status);
      toast.success(`Request ${status} successfully!`);
      
      // Reload join requests for this project
      await loadJoinRequests(projectId);
      
      // Reload projects to get updated member list
      await loadProjects();
    } catch (error: any) {
      console.error(`Failed to ${status} request:`, error);
      toast.error(`Failed to ${status} request: ${error.message || 'Unknown error'}`);
    } finally {
      setProcessingRequest(null);
    }
  };

  const extractId = (id: string | { $oid: string } | undefined): string => {
    if (!id) return '';
    return typeof id === 'string' ? id : (id as any).$oid || '';
  };

  const isProjectLead = (project: any): boolean => {
    if (!user) return false;
    const userId = user._id || user.id;
    const userIdStr = typeof userId === 'string' ? userId : (userId as any)?.$oid;
    const leadId = project.project_lead_id;
    const leadIdStr = typeof leadId === 'string' ? leadId : (leadId as any)?.$oid;
    return userIdStr === leadIdStr;
  };

  const handleRemoveMember = async (projectId: string, memberId: string, memberName: string) => {
    if (!token) return;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Member',
      message: `Are you sure you want to remove ${memberName} from this project?`,
      onConfirm: async () => {
        setRemovingMember(memberId);
        
        const payload = {
          project_id: projectId,
          member_id: memberId
        };
        
        try {
          await projectsAPI.remove(token, payload);
          toast.success(`${memberName} has been removed from the project successfully!`);
          
          // Reload projects to get updated member list
          await loadProjects();
        } catch (error: any) {
          console.error('Failed to remove member:', error);
          toast.error(`Failed to remove member: ${error.message || 'Unknown error'}`);
        } finally {
          setRemovingMember(null);
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'on hold':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Projects</h1>
          <p className="text-gray-400">View and manage your assigned projects</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 glass-card rounded-xl border border-primary/10"
          >
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-gray-400">You haven't been assigned to any projects yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="space-y-2 text-sm">
                  {project.members && project.members.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  
                  {project.created_at && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Projects Where User is Lead - With Management Options */}
        {!loading && projects.filter(p => isProjectLead(p)).length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">My Led Projects</h2>
              <p className="text-gray-400">Manage your projects, members, and join requests</p>
            </div>

            {projects.filter(p => isProjectLead(p)).map((project) => {
              const projectId = extractId(project._id);
              const members = (project.member_ids || []).map((id: any) => extractId(id));
              const requests = joinRequests[projectId] || [];
              const loadingReqs = loadingRequests[projectId];

              return (
                <motion.div
                  key={projectId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-xl border border-primary/10"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        {project.github_link && (
                          <a
                            href={project.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            View on GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Join Requests */}
                  {(requests.length > 0 || loadingReqs) && (
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-cyan-400" />
                        Join Requests ({requests.length})
                      </h4>

                      {loadingReqs ? (
                        <div className="text-center py-4">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {requests.map((request) => {
                            const requestId = extractId(request._id);
                            const isProcessing = processingRequest === requestId;

                            return (
                              <motion.div
                                key={requestId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white/5 border border-white/10 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold">{request.user.full_name}</span>
                                      <span className="text-gray-400 text-sm">(@{request.user.username})</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                      <Mail className="w-3 h-3" />
                                      <span>{request.user.email}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {new Date(request.created_at).toLocaleDateString()}
                                  </span>
                                </div>

                                <p className="text-gray-300 text-sm mb-3 bg-black/20 p-3 rounded border border-white/5">
                                  {request.message}
                                </p>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleJoinRequest(requestId, 'approved', projectId)}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                  >
                                    {isProcessing ? 'Processing...' : 'Approve'}
                                  </button>
                                  <button
                                    onClick={() => handleJoinRequest(requestId, 'rejected', projectId)}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                  >
                                    {isProcessing ? 'Processing...' : 'Reject'}
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Project Files */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <ProjectFiles
                      projectId={projectId}
                      files={project.files || []}
                      isProjectLead={true}
                      onFilesUpdate={() => loadProjects()}
                    />
                  </div>

                  {/* Project Members */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Project Members ({members.length})
                    </h4>

                    {members.length === 0 ? (
                      <p className="text-gray-400 text-sm">No members in this project yet</p>
                    ) : (
                      <div className="space-y-3">
                        {members.map((memberId: string) => {
                          // Try to fetch user details if not in cache
                          if (!userCache[memberId]) {
                            fetchUserDetails(memberId);
                          }
                          
                          const memberDetails = userCache[memberId];

                          const isRemoving = removingMember === memberId;
                          const isCurrentUserLead = extractId(project.project_lead_id) === memberId;

                          return (
                            <div
                              key={memberId}
                              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                                  <Users className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {memberDetails?.full_name || memberDetails?.username || `Loading... (${memberId.substring(0, 8)})`}
                                    {isCurrentUserLead && (
                                      <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                                        Project Lead
                                      </span>
                                    )}
                                  </p>
                                  {memberDetails?.username && (
                                    <p className="text-sm text-gray-400">@{memberDetails.username}</p>
                                  )}
                                  {memberDetails?.email && (
                                    <p className="text-xs text-gray-500">{memberDetails.email}</p>
                                  )}
                                </div>
                              </div>
                              
                              {!isCurrentUserLead && (
                                <button
                                  onClick={() => handleRemoveMember(
                                    projectId, 
                                    memberId, 
                                    memberDetails?.full_name || memberDetails?.username || 'this member'
                                  )}
                                  disabled={isRemoving}
                                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                >
                                  {isRemoving ? 'Removing...' : 'Remove'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        type="danger"
      />
    </DashboardLayout>
  );
}
