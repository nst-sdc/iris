'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectFiles } from '@/components/project-files';
import { useToast } from '@/contexts/ToastContext';

interface ProjectDetailsPageProps {
  projectId: string;
}

export function ProjectDetailsWithFiles({ projectId }: ProjectDetailsPageProps) {
  const { user, token } = useAuth();
  const toast = useToast();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'files'>('overview');

  const extractId = (id: any): string => {
    if (!id) return '';
    if (typeof id === 'object' && id.$oid) return id.$oid;
    if (typeof id === 'string') return id;
    return String(id);
  };

  const loadProject = async () => {
    try {
      const response = await fetch('http://localhost:5657/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load projects');

      const projects = await response.json();
      const foundProject = projects.find((p: any) => extractId(p._id) === projectId);

      if (foundProject) {
        setProject(foundProject);
      }
    } catch (error: any) {
      console.error('Error loading project:', error);
      toast?.showToast('error', 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && projectId) {
      loadProject();
    }
  }, [token, projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Project not found</div>
      </div>
    );
  }

  const userId = extractId(user?._id || user?.id);
  const projectLeadId = extractId(project.project_lead_id);
  const isProjectLead = userId === projectLeadId;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
        <p className="text-gray-400">{project.description}</p>
        {isProjectLead && (
          <div className="mt-4 px-3 py-1 bg-primary/10 text-primary text-sm rounded inline-block">
            You are the Project Lead
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'files'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Files ({project.files?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-white">{project.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Members</p>
                  <p className="text-white">{project.member_ids?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created</p>
                  <p className="text-white">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                {project.github_link && (
                  <div>
                    <p className="text-sm text-gray-400">GitHub</p>
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Repository
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <ProjectFiles
            projectId={projectId}
            files={project.files || []}
            isProjectLead={isProjectLead}
            onFilesUpdate={loadProject}
          />
        )}
      </div>
    </div>
  );
}
