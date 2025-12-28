'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// @ts-ignore
import { Upload, File, Trash2, Download, Eye, X } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { StlViewer } from './ui/stl-viewer';
import { DxfViewer } from './ui/dxf-viewer';

interface ProjectFile {
  _id: string;
  name: string;
  url: string;
  file_type: string;
  size: number;
  uploaded_by: string;
  uploaded_at: string;
}

interface ProjectFilesProps {
  projectId: string;
  files: ProjectFile[];
  isProjectLead: boolean;
  onFilesUpdate: () => void;
}

export function ProjectFiles({ projectId, files, isProjectLead, onFilesUpdate }: ProjectFilesProps) {
  const [uploading, setUploading] = useState(false);
  const [viewingFile, setViewingFile] = useState<ProjectFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Helper to extract string ID from ObjectId
  const extractId = (id: any): string => {
    if (!id) return '';
    if (typeof id === 'string') return id;
    if (typeof id === 'object' && id.$oid) return id.$oid;
    return String(id);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!isProjectLead) {
      alert('Only project leads can upload files');
      return;
    }

    for (const file of acceptedFiles) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'stl' && ext !== 'dxf') {
        alert(`Invalid file type: ${file.name}. Only .stl and .dxf files are allowed.`);
        continue;
      }

      try {
        setUploading(true);
        setUploadProgress(`Uploading ${file.name}...`);

        // Upload to Cloudinary
        const cloudinaryResponse = await uploadToCloudinary(file);

        // Add file to project in backend
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5657/projects/files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_id: projectId,
            name: file.name,
            url: cloudinaryResponse.secure_url,
            file_type: ext,
            size: file.size,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        setUploadProgress('');
        onFilesUpdate();
      } catch (error: any) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  }, [projectId, isProjectLead, onFilesUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.stl', '.dxf'],
    },
    disabled: !isProjectLead || uploading,
  });

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!isProjectLead) return;
    
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      const token = localStorage.getItem('token');
      
      // Extract the actual ID string
      const cleanFileId = extractId(fileId);
      const cleanProjectId = extractId(projectId);
      
      console.log('Deleting file:', { cleanProjectId, cleanFileId });
      
      const response = await fetch('http://localhost:5657/projects/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: cleanProjectId,
          file_id: cleanFileId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        throw new Error(errorText || 'Failed to delete file');
      }

      onFilesUpdate();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Failed to delete file: ${error.message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {isProjectLead && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-700 hover:border-gray-600'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {uploading ? (
            <p className="text-gray-400">{uploadProgress}</p>
          ) : isDragActive ? (
            <p className="text-primary">Drop the files here...</p>
          ) : (
            <>
              <p className="text-gray-300 mb-2">
                Drag and drop .stl or .dxf files here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Accepted formats: STL, DXF
              </p>
            </>
          )}
        </div>
      )}

      {/* Files List */}
      <div className="space-y-3">
        {files && files.length > 0 ? (
          files.map((file) => {
            const fileId = extractId(file._id);
            return (
            <div
              key={fileId}
              className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                  <File className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{file.name}</h4>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(file.size)} • {formatDate(file.uploaded_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewingFile(file)}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  title="View"
                >
                  <Eye className="w-5 h-5 text-gray-400" />
                </button>
                <a
                  href={file.url}
                  download={file.name}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-gray-400" />
                </a>
                {isProjectLead && (
                  <button
                    onClick={() => handleDelete(fileId, file.name)}
                    className="p-2 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                )}
              </div>
            </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500">
            <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet</p>
            {isProjectLead && <p className="text-sm mt-2">Upload your first .stl or .dxf file above</p>}
          </div>
        )}
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
              <h3 className="text-xl font-bold text-white">{viewingFile.name}</h3>
              <button
                onClick={() => setViewingFile(null)}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6 overflow-auto flex-1">
              {viewingFile.file_type === 'stl' ? (
                <StlViewer url={viewingFile.url} />
              ) : (
                <DxfViewer url={viewingFile.url} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
