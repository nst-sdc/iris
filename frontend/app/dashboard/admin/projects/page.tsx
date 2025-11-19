"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Github, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectsAPI, usersAPI } from '@/lib/api';

interface User {
  _id: string | { $oid: string };
  username: string;
  full_name: string;
  role: string;
}

interface ProjectMember {
  _id: string;
  username: string;
  full_name: string;
}

interface Project {
  _id: string | { $oid: string };
  name: string;
  description: string;
  status: string;
  github_link?: string;
  member_ids?: string[];
  project_lead_id?: string | { $oid: string };
  created_at: string;
  members?: ProjectMember[];
}

export default function ProjectsPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      router.push('/dashboard/member/projects');
    }
  }, [user, router]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    github_link: '',
    project_lead_id: '',
  });

  useEffect(() => {
    if (token) {
      loadProjects();
      loadUsers();
    }
  }, [token]);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll(token!);
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getMembers(token!);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const extractId = (id: string | { $oid: string } | undefined): string => {
    if (!id) return '';
    return typeof id === 'string' ? id : id.$oid || '';
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Auth check - user:', user);
    console.log('Auth check - token:', token);
    
    if (!user) {
      toast.error('User not authenticated - please log in again');
      return;
    }

    const userId = user._id || user.id;
    if (!userId) {
      toast.error('User ID not found - please log in again');
      return;
    }

    setSubmitting(true);
    try {
      const adminId = extractId(userId);
      console.log('Creating project with data:', {
        ...formData,
        created_by: adminId,
        project_lead_id: formData.project_lead_id || undefined,
      });
      
      const response = await projectsAPI.create(token!, {
        ...formData,
        created_by: adminId,
        project_lead_id: formData.project_lead_id || undefined,
      });
      
      console.log('Project created successfully:', response);
      toast.success('Project created successfully!');
      
      setShowCreateModal(false);
      setFormData({ name: '', description: '', status: 'active', github_link: '', project_lead_id: '' });
      await loadProjects();
    } catch (error: any) {
      console.error('Failed to create project:', error);
      toast.error(`Failed to create project: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      const projectId = extractId(selectedProject._id);
      await projectsAPI.update(token!, {
        project_id: projectId,
        ...formData,
      });
      
      setShowEditModal(false);
      setSelectedProject(null);
      setFormData({ name: '', description: '', status: 'active', github_link: '', project_lead_id: '' });
      loadProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (project: Project) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project',
      message: `Delete project "${project.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const projectId = extractId(project._id);
          await projectsAPI.delete(token!, { project_id: projectId });
          toast.success('Project deleted successfully');
          loadProjects();
        } catch (error) {
          console.error('Failed to delete project:', error);
          toast.error('Failed to delete project');
        }
      },
    });
  };

  const handleAddMember = async (memberId: string) => {
    if (!selectedProject) return;

    try {
      const projectId = extractId(selectedProject._id);
      await projectsAPI.assign(token!, {
        project_id: projectId,
        member_id: memberId,
      });
      loadProjects();
      // Refresh selected project
      const updated = await projectsAPI.getAll(token!);
      const updatedProject = updated.find((p: Project) => extractId(p._id) === projectId);
      if (updatedProject) setSelectedProject(updatedProject);
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedProject) return;

    try {
      const projectId = extractId(selectedProject._id);
      await projectsAPI.remove(token!, {
        project_id: projectId,
        member_id: memberId,
      });
      loadProjects();
      // Refresh selected project
      const updated = await projectsAPI.getAll(token!);
      const updatedProject = updated.find((p: Project) => extractId(p._id) === projectId);
      if (updatedProject) setSelectedProject(updatedProject);
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleSetProjectLead = async (memberId: string) => {
    if (!selectedProject) return;

    try {
      const projectId = extractId(selectedProject._id);
      await projectsAPI.setLead(token!, {
        project_id: projectId,
        member_id: memberId,
      });
      loadProjects();
      // Refresh selected project
      const updated = await projectsAPI.getAll(token!);
      const updatedProject = updated.find((p: Project) => extractId(p._id) === projectId);
      if (updatedProject) setSelectedProject(updatedProject);
    } catch (error) {
      console.error('Failed to set project lead:', error);
      toast.error('Failed to set project lead');
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status.toLowerCase(),
      github_link: project.github_link || '',
      project_lead_id: extractId(project.project_lead_id),
    });
    setShowEditModal(true);
  };

  const openMembersModal = (project: Project) => {
    setSelectedProject(project);
    setShowMembersModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'onhold':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getProjectMembers = (project: Project): string[] => {
    return project.member_ids || [];
  };

  const getUserById = (userId: string) => {
    return users.find(u => extractId(u._id) === userId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects Management</h1>
            <p className="text-gray-400">Create and manage all projects</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Create New Project
          </button>
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
            <p className="text-gray-400">Create your first project to get started.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => {
              const projectId = extractId(project._id);
              const leadId = extractId(project.project_lead_id);
              const projectLead = getUserById(leadId);
              const memberCount = getProjectMembers(project).length;

              return (
                <motion.div
                  key={projectId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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

                  <div className="space-y-2 text-sm mb-4">
                    {projectLead && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-yellow-400">👑</span>
                        <span>Lead: {projectLead.full_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                    </div>
                    {project.created_at && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => openEditModal(project)}
                      className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>✏️</span>
                      Edit
                    </button>
                    <button 
                      onClick={() => openMembersModal(project)}
                      className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Members
                    </button>
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    <button 
                      onClick={() => handleDeleteProject(project)}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm font-medium transition-colors text-red-400"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Create Project Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-6 rounded-xl border border-primary/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Create New Project</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                      placeholder="Enter project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50 min-h-[100px]"
                      placeholder="Enter project description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="onhold">On Hold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Project Lead</label>
                      <select
                        value={formData.project_lead_id}
                        onChange={(e) => setFormData({ ...formData, project_lead_id: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                      >
                        <option value="">No Lead</option>
                        {users.map((u) => (
                          <option key={extractId(u._id)} value={extractId(u._id)}>
                            {u.full_name} (@{u.username})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Link</label>
                    <input
                      type="url"
                      value={formData.github_link}
                      onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-white/5 border border-primary/20 rounded-lg font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Creating...' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Project Modal */}
        <AnimatePresence>
          {showEditModal && selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-6 rounded-xl border border-primary/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Edit Project</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="onhold">On Hold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Project Lead</label>
                      <select
                        value={formData.project_lead_id}
                        onChange={(e) => setFormData({ ...formData, project_lead_id: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                      >
                        <option value="">No Lead</option>
                        {users.map((u) => (
                          <option key={extractId(u._id)} value={extractId(u._id)}>
                            {u.full_name} (@{u.username})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Link</label>
                    <input
                      type="url"
                      value={formData.github_link}
                      onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-6 py-3 bg-white/5 border border-primary/20 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Update Project
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Members Management Modal */}
        <AnimatePresence>
          {showMembersModal && selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowMembersModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-6 rounded-xl border border-primary/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Manage Members - {selectedProject.name}</h2>
                  <button onClick={() => setShowMembersModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Current Members */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Current Members</h3>
                    <div className="space-y-2">
                      {getProjectMembers(selectedProject).length === 0 ? (
                        <p className="text-gray-400 text-sm">No members assigned yet</p>
                      ) : (
                        getProjectMembers(selectedProject).map((memberId) => {
                          const member = getUserById(memberId);
                          if (!member) return null;
                          const isLead = extractId(selectedProject.project_lead_id) === memberId;

                          return (
                            <div key={memberId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-primary/20">
                              <div className="flex items-center gap-3">
                                {isLead && <span className="text-yellow-400">👑</span>}
                                <div>
                                  <p className="font-medium">{member.full_name}</p>
                                  <p className="text-sm text-gray-400">@{member.username}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {!isLead && (
                                  <button
                                    onClick={() => handleSetProjectLead(memberId)}
                                    className="px-3 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded text-sm text-yellow-400 transition-colors"
                                  >
                                    Set as Lead
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemoveMember(memberId)}
                                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-sm text-red-400 transition-colors flex items-center gap-1"
                                >
                                  <span>➖</span>
                                  Remove
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Available Users */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Available Users</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {users
                        .filter(u => !getProjectMembers(selectedProject).includes(extractId(u._id)))
                        .map((user) => (
                          <div key={extractId(user._id)} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-primary/20">
                            <div>
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-sm text-gray-400">@{user.username}</p>
                            </div>
                            <button
                              onClick={() => handleAddMember(extractId(user._id))}
                              className="px-3 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded text-sm transition-colors flex items-center gap-1"
                            >
                              <span>➕</span>
                              Add
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
}

