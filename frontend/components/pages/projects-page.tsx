"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Users, Calendar, UserPlus, X } from "lucide-react";
import { projectsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import { ProjectFiles } from "@/components/project-files";

interface Project {
  _id: string | { $oid: string };
  name: string;
  description: string;
  status: string;
  github_link?: string;
  member_ids?: string[];
  project_lead_id?: string | { $oid: string };
  created_at: string;
  files?: any[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = (i: number) => ({
  initial: {
    opacity: 0,
    x: -50
  },
  animate: () => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6
    }
  })
});

// Helper to safely extract ID from ObjectId or string
const extractUserId = (id: any): string => {
  if (!id) return '';
  if (typeof id === 'string') return id;
  if (typeof id === 'object' && '$oid' in id) return id.$oid;
  return String(id);
};

export default function ProjectsPage() {
  const { user, token } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<'all' | 'active' | 'completed' | 'onhold'>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const projectsData = await projectsAPI.getAll();
      setProjects(projectsData);
      setFilteredProjects(projectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.status.toLowerCase() === activeCategory));
    }
  }, [activeCategory, projects]);

  const extractId = (id: string | { $oid: string } | undefined): string => {
    if (!id) return '';
    return typeof id === 'string' ? id : id.$oid || '';
  };

  const handleCategoryChange = (category: 'all' | 'active' | 'completed' | 'onhold') => {
    setActiveCategory(category);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setShowJoinModal(false);
    setJoinMessage("");
  };

  const isUserMember = (project: Project): boolean => {
    if (!user) return false;
    const userId = user._id || user.id;
    if (!userId) return false;
    const userIdStr = extractUserId(userId);
    
    // Check if user is a member
    const isMember = project.member_ids?.some(memberId => {
      const memberIdStr = extractUserId(memberId);
      return memberIdStr === userIdStr;
    }) || false;
    
    // Check if user is the project lead
    const projectLeadId = project.project_lead_id;
    const leadIdStr = extractUserId(projectLeadId);
    const isLead = leadIdStr === userIdStr;
    
    console.log('Checking membership for project:', project.name);
    console.log('User ID:', userIdStr);
    console.log('Member IDs:', project.member_ids);
    console.log('Project Lead ID:', leadIdStr);
    console.log('Is Member:', isMember, 'Is Lead:', isLead);
    
    return isMember || isLead;
  };

  const handleJoinRequest = () => {
    if (!user || !token) {
      toast.warning('Please log in to request joining a project');
      router.push('/login');
      return;
    }
    setShowJoinModal(true);
  };

  const submitJoinRequest = async () => {
    if (!selectedProject || !token) return;

    if (!joinMessage.trim()) {
      toast.warning('Please provide a message with your request');
      return;
    }

    setSubmitting(true);
    try {
      const projectId = extractId(selectedProject._id);
      await projectsAPI.createJoinRequest(token, {
        project_id: projectId,
        message: joinMessage.trim()
      });
      toast.success('Join request sent successfully!');
      setShowJoinModal(false);
      setJoinMessage("");
    } catch (error: any) {
      console.error('Failed to send join request:', error);
      toast.error(`Failed to send request: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10';
      case 'onhold':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <>
      {/* Hero Header */}
      <section className="relative bg-black pt-32 pb-12 sm:pb-16">
        <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Our <span className="text-gradient">Projects</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl">
              Explore our innovative robotics projects, from ongoing research to completed achievements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative bg-black py-8 border-b border-zinc-800/50">
        <div className="container-custom max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {(['all', 'active', 'completed', 'onhold'] as const).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-white text-black'
                    : 'bg-zinc-900/50 text-gray-400 border border-zinc-800/50 hover:bg-zinc-800/50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative bg-black py-16 sm:py-24">
        <div className="container-custom max-w-6xl px-4 sm:px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
              <p className="mt-4 text-gray-400">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No projects available yet. Check back soon!
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {filteredProjects.map((project, index) => {
                const projectId = extractId(project._id);
                const memberCount = project.member_ids?.length || 0;

                return (
                  <motion.div
                    key={projectId}
                    custom={index}
                    variants={cardVariants(index)}
                    initial="initial"
                    animate="animate"
                    className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 overflow-hidden hover:border-zinc-700/50 hover:bg-zinc-900/50 transition-all duration-300 cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {/* Project Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-white/70 px-4 text-center">{project.name}</span>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                        </div>
                        {project.created_at && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(project.created_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
                        >
                          <Github className="w-4 h-4" />
                          View on GitHub
                        </a>
                      )}

                      {/* Request to Join Button */}
                      {user && !isUserMember(project) && user.role !== 'Admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            handleJoinRequest();
                          }}
                          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all text-sm font-medium"
                        >
                          <UserPlus className="w-4 h-4" />
                          Request to Join
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl border border-zinc-800/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-gray-400 hover:text-white z-10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="p-8">
                <div className="mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                  <h2 className="text-3xl font-bold text-white mt-4">{selectedProject.name}</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
                    <p className="text-gray-300">{selectedProject.description}</p>
                  </div>

                  {selectedProject.member_ids && selectedProject.member_ids.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">Team Members</h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-5 h-5" />
                        <span>{selectedProject.member_ids.length} member{selectedProject.member_ids.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}

                  {selectedProject.github_link && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">Project Links</h3>
                      <a
                        href={selectedProject.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white hover:bg-zinc-700/50 transition-all"
                      >
                        <Github className="w-5 h-5" />
                        GitHub Repository
                      </a>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Created</h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(selectedProject.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  {/* Project Files Section */}
                  {(selectedProject.files && selectedProject.files.length > 0) || isUserMember(selectedProject) || user?.role === 'Admin' ? (
                    <div className="pt-6 border-t border-zinc-800">
                      <h3 className="text-lg font-semibold mb-4 text-white">Project Files</h3>
                      <ProjectFiles
                        projectId={extractId(selectedProject._id)}
                        files={selectedProject.files || []}
                        isProjectLead={
                          user ? (
                            user.role === 'Admin' || 
                            extractId(selectedProject.project_lead_id) === extractUserId(user._id || user.id)
                          ) : false
                        }
                        onFilesUpdate={loadData}
                      />
                    </div>
                  ) : null}

                  {/* Request to Join Section */}
                  {!user ? (
                    <div className="pt-4 border-t border-zinc-800">
                      <p className="text-center text-gray-400 mb-3">Want to join this project?</p>
                      <a
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        Login to Request Access
                      </a>
                    </div>
                  ) : user.role === 'Admin' ? (
                    <div className="pt-4 border-t border-zinc-800">
                      <p className="text-center text-sm text-gray-400">
                        You have admin access to all projects
                      </p>
                    </div>
                  ) : isUserMember(selectedProject) ? (
                    <div className="pt-4 border-t border-zinc-800">
                      <p className="text-center text-sm text-green-400">
                        ✓ You are a member of this project
                      </p>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-zinc-800">
                      <p className="text-center text-gray-400 mb-3">Interested in joining this project?</p>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleJoinRequest();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        <UserPlus className="w-5 h-5" />
                        Request to Join This Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Request Modal */}
      <AnimatePresence>
        {showJoinModal && selectedProject && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              className="relative w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800/50 p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowJoinModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-white">Request to Join</h2>
              <p className="text-gray-400 mb-4">Project: <span className="text-white font-semibold">{selectedProject.name}</span></p>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">
                  Message to Project Lead <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Tell the project lead why you want to join this project..."
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-primary/20 rounded-lg focus:outline-none focus:border-primary/50 text-white resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Explain your skills and why you'd be a good fit</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-white/5 border border-primary/20 rounded-lg font-semibold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={submitJoinRequest}
                  disabled={submitting || !joinMessage.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
