"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Pencil, Trash2, X, Star, Search, Upload, Link } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { galleryAPI } from '@/lib/api';

interface GalleryItem {
  _id: string | { $oid: string };
  title: string;
  category: string;
  image_url: string;
  description: string;
  thumbnail_url?: string;
  uploaded_by: string | { $oid: string };
  featured: boolean;
  created_at: string;
}

const CATEGORIES = ['Hackathon', 'Workshop', 'Competition', 'Team', 'Project', 'Other'];

export default function AdminGalleryPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon',
    image_url: '',
    description: '',
    thumbnail_url: '',
    featured: false,
  });

  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress and convert image file to base64 data URL
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData(prev => ({ ...prev, image_url: dataUrl }));
        // Generate smaller thumbnail
        const thumbCanvas = document.createElement('canvas');
        const THUMB_DIM = 300;
        let tw = width, th = height;
        if (tw > THUMB_DIM || th > THUMB_DIM) {
          if (tw > th) {
            th = Math.round((th * THUMB_DIM) / tw);
            tw = THUMB_DIM;
          } else {
            tw = Math.round((tw * THUMB_DIM) / th);
            th = THUMB_DIM;
          }
        }
        thumbCanvas.width = tw;
        thumbCanvas.height = th;
        const thumbCtx = thumbCanvas.getContext('2d')!;
        thumbCtx.drawImage(img, 0, 0, tw, th);
        const thumbDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.6);
        setFormData(prev => ({ ...prev, thumbnail_url: thumbDataUrl }));
        setUploadingImage(false);
        toast.success('Image loaded successfully');
      };
      img.onerror = () => {
        setUploadingImage(false);
        toast.error('Failed to process image');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setUploadingImage(false);
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      router.push('/dashboard/member');
    }
  }, [user, router]);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const data = await galleryAPI.getAll();
      setItems(data);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const extractId = (id: string | { $oid: string } | undefined): string => {
    if (!id) return '';
    return typeof id === 'string' ? id : id.$oid || '';
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Hackathon',
      image_url: '',
      description: '',
      thumbnail_url: '',
      featured: false,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await galleryAPI.create(token, {
        title: formData.title,
        category: formData.category,
        image_url: formData.image_url,
        description: formData.description,
        thumbnail_url: formData.thumbnail_url || null,
        featured: formData.featured,
      });
      toast.success('Gallery item created successfully');
      setShowCreateModal(false);
      resetForm();
      loadGallery();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedItem) return;
    setSubmitting(true);
    try {
      await galleryAPI.update(token, {
        id: extractId(selectedItem._id),
        title: formData.title,
        category: formData.category,
        image_url: formData.image_url,
        description: formData.description,
        thumbnail_url: formData.thumbnail_url || null,
        featured: formData.featured,
      });
      toast.success('Gallery item updated successfully');
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      loadGallery();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item: GalleryItem) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Gallery Item',
      message: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await galleryAPI.delete(token!, { id: extractId(item._id) });
          toast.success('Gallery item deleted');
          loadGallery();
        } catch (error: any) {
          toast.error(error.message || 'Failed to delete gallery item');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const openEditModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      image_url: item.image_url,
      description: item.description,
      thumbnail_url: item.thumbnail_url || '',
      featured: item.featured,
    });
    setShowEditModal(true);
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Hackathon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Workshop: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      Competition: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      Team: 'bg-green-500/20 text-green-400 border-green-500/30',
      Project: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[category] || colors.Other;
  };

  const renderFormModal = (isEdit: boolean) => (
    <motion.div
      key={isEdit ? 'edit-modal' : 'create-modal'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={() => isEdit ? setShowEditModal(false) : setShowCreateModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 rounded-xl border border-primary/20 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{isEdit ? 'Edit' : 'Add'} Gallery Item</h3>
          <button
            onClick={() => isEdit ? setShowEditModal(false) : setShowCreateModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={isEdit ? handleEdit : handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none text-white"
              placeholder="e.g., Hackathon 2025 Photos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none text-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Image *</label>
            {/* Tab switcher */}
            <div className="flex mb-2 border border-primary/10 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all ${
                  imageInputMode === 'upload'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-dark-300/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all ${
                  imageInputMode === 'url'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-dark-300/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                <Link className="w-4 h-4" />
                URL
              </button>
            </div>

            {imageInputMode === 'upload' ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-cyan-400'); }}
                  onDragLeave={e => { e.currentTarget.classList.remove('border-cyan-400'); }}
                  onDrop={e => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-cyan-400');
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="w-full px-4 py-6 bg-dark-300/50 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer hover:border-primary/40 transition-all text-center"
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-400 text-sm">Processing image...</span>
                    </div>
                  ) : formData.image_url && formData.image_url.startsWith('data:') ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={formData.image_url} alt="Uploaded" className="max-h-24 rounded object-cover" />
                      <span className="text-cyan-400 text-xs">Click or drag to replace</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-500" />
                      <span className="text-gray-400 text-sm">Click or drag & drop an image</span>
                      <span className="text-gray-500 text-xs">JPG, PNG, WebP (max 10MB)</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <input
                type="url"
                required={!formData.image_url}
                value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none text-white"
                placeholder="https://res.cloudinary.com/..."
              />
            )}
            {formData.image_url && !formData.image_url.startsWith('data:') && (
              <div className="mt-2 rounded-lg overflow-hidden border border-primary/10">
                <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail URL (optional)</label>
            <p className="text-xs text-gray-500 mb-1">
              {imageInputMode === 'upload' ? 'Auto-generated from upload' : 'Smaller version for faster loading'}
            </p>
            <input
              type="url"
              value={formData.thumbnail_url.startsWith('data:') ? '(auto-generated from upload)' : formData.thumbnail_url}
              onChange={e => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
              disabled={formData.thumbnail_url.startsWith('data:')}
              className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none text-white disabled:opacity-50"
              placeholder="Smaller version for faster loading"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none text-white resize-none"
              placeholder="Describe this gallery item..."
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
            <span className="text-sm text-gray-300">Featured item</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => isEdit ? setShowEditModal(false) : setShowCreateModal(false)}
              className="px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg hover:bg-dark-300 text-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Gallery Management</h1>
            <p className="text-gray-400 mt-1">Add and manage photos across categories</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Photo
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                filterCategory === 'All'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  : 'bg-dark-300/50 text-gray-400 border-primary/10 hover:border-primary/30'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  filterCategory === cat
                    ? getCategoryColor(cat)
                    : 'bg-dark-300/50 text-gray-400 border-primary/10 hover:border-primary/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold">{items.length}</p>
            <p className="text-gray-400 text-sm">Total Photos</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold">{items.filter(i => i.featured).length}</p>
            <p className="text-gray-400 text-sm">Featured</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold">{new Set(items.map(i => i.category)).size}</p>
            <p className="text-gray-400 text-sm">Categories Used</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold">{filteredItems.length}</p>
            <p className="text-gray-400 text-sm">Showing</p>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="text-gray-400 mt-4">Loading gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {items.length === 0 ? 'No photos yet' : 'No matching photos'}
            </h3>
            <p className="text-gray-500">
              {items.length === 0 ? 'Add your first photo to get started.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={extractId(item._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl border border-primary/10 overflow-hidden group hover:border-primary/30 transition-all"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-dark-300/50 relative overflow-hidden">
                  <img
                    src={item.thumbnail_url || item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = '';
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {item.featured && (
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-500/90">
                      <Star className="w-3 h-3 text-white" fill="white" />
                    </div>
                  )}
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white truncate">{item.title}</h3>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  {item.description && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && renderFormModal(false)}
        {showEditModal && renderFormModal(true)}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        type="danger"
        confirmText="Delete"
      />
    </DashboardLayout>
  );
}
