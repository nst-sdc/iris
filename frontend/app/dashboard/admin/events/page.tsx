"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Pencil, Trash2, X, Star, Search, MapPin, Clock, Users, Upload, Link } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { eventsAPI } from '@/lib/api';

interface EventSpeaker {
  name: string;
  role: string;
  avatar?: string;
}

interface EventItem {
  _id: string | { $oid: string };
  title: string;
  date: string;
  time: string;
  end_date?: string;
  location: string;
  event_type: string;
  status: string;
  description: string;
  image?: string;
  featured: boolean;
  register_link?: string;
  recap_link?: string;
  speakers?: EventSpeaker[];
  created_by: string | { $oid: string };
  created_at: string;
  updated_at: string;
}

const EVENT_TYPES = ['Workshop', 'Competition', 'Hackathon', 'Meetup', 'Other'];
const EVENT_STATUSES = ['Upcoming', 'Ongoing', 'Completed'];

export default function AdminEventsPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
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

  const emptyForm = {
    title: '',
    date: '',
    time: '',
    end_date: '',
    location: '',
    event_type: 'Workshop',
    status: 'Upcoming',
    description: '',
    image: '',
    featured: false,
    register_link: '',
    recap_link: '',
    speakers: [] as { name: string; role: string; avatar: string }[],
  };

  const [formData, setFormData] = useState(emptyForm);
  const [eventImageMode, setEventImageMode] = useState<'url' | 'upload'>('upload');
  const [uploadingEventImage, setUploadingEventImage] = useState(false);
  const eventFileInputRef = useRef<HTMLInputElement>(null);

  const handleEventFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be less than 10MB'); return; }
    setUploadingEventImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let w = img.width, h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) { h = Math.round((h * MAX_DIM) / w); w = MAX_DIM; }
          else { w = Math.round((w * MAX_DIM) / h); h = MAX_DIM; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        setFormData(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.8) }));
        setUploadingEventImage(false);
        toast.success('Image loaded successfully');
      };
      img.onerror = () => { setUploadingEventImage(false); toast.error('Failed to process image'); };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => { setUploadingEventImage(false); toast.error('Failed to read file'); };
    reader.readAsDataURL(file);
  };

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      router.push('/dashboard/member');
    }
  }, [user, router]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventsAPI.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const extractId = (id: string | { $oid: string } | undefined): string => {
    if (!id) return '';
    return typeof id === 'string' ? id : id.$oid || '';
  };

  const resetForm = () => setFormData(emptyForm);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      const payload: any = {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        event_type: formData.event_type,
        status: formData.status,
        description: formData.description,
        featured: formData.featured,
      };
      if (formData.end_date) payload.end_date = formData.end_date;
      if (formData.image) payload.image = formData.image;
      if (formData.register_link) payload.register_link = formData.register_link;
      if (formData.recap_link) payload.recap_link = formData.recap_link;
      if (formData.speakers.length > 0) payload.speakers = formData.speakers.filter(s => s.name.trim());

      await eventsAPI.create(token, payload);
      toast.success('Event created successfully');
      setShowCreateModal(false);
      resetForm();
      loadEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedEvent) return;
    setSubmitting(true);
    try {
      const payload: any = {
        id: extractId(selectedEvent._id),
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        event_type: formData.event_type,
        status: formData.status,
        description: formData.description,
        featured: formData.featured,
      };
      if (formData.end_date) payload.end_date = formData.end_date;
      if (formData.image) payload.image = formData.image;
      if (formData.register_link) payload.register_link = formData.register_link;
      if (formData.recap_link) payload.recap_link = formData.recap_link;
      if (formData.speakers.length > 0) payload.speakers = formData.speakers.filter(s => s.name.trim());

      await eventsAPI.update(token, payload);
      toast.success('Event updated successfully');
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
      loadEvents();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (event: EventItem) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Event',
      message: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await eventsAPI.delete(token!, { id: extractId(event._id) });
          toast.success('Event deleted');
          loadEvents();
        } catch (error: any) {
          toast.error(error.message || 'Failed to delete event');
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const openEditModal = (event: EventItem) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      end_date: event.end_date || '',
      location: event.location,
      event_type: event.event_type,
      status: event.status,
      description: event.description,
      image: event.image || '',
      featured: event.featured,
      register_link: event.register_link || '',
      recap_link: event.recap_link || '',
      speakers: event.speakers?.map(s => ({ name: s.name, role: s.role, avatar: s.avatar || '' })) || [],
    });
    setShowEditModal(true);
  };

  const addSpeaker = () => {
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, { name: '', role: '', avatar: '' }],
    }));
  };

  const removeSpeaker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }));
  };

  const updateSpeaker = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.map((s, i) => i === index ? { ...s, [field]: value } : s),
    }));
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'All' || event.event_type === filterType;
    const matchesStatus = filterStatus === 'All' || event.status === filterStatus;
    const matchesSearch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Upcoming: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      Ongoing: 'bg-green-500/20 text-green-400 border-green-500/30',
      Completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || colors.Completed;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Workshop: 'bg-purple-500/20 text-purple-400',
      Competition: 'bg-amber-500/20 text-amber-400',
      Hackathon: 'bg-pink-500/20 text-pink-400',
      Meetup: 'bg-blue-500/20 text-blue-400',
      Other: 'bg-gray-500/20 text-gray-400',
    };
    return colors[type] || colors.Other;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
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
        className="glass-card p-6 rounded-xl border border-primary/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{isEdit ? 'Edit' : 'Create'} Event</h3>
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
              className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
              placeholder="e.g., Arduino Workshop 2025"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Time *</label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
                placeholder="e.g., 02:00 PM - 05:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date (optional)</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
                placeholder="e.g., Robotics Lab, Building 4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Type *</label>
              <select
                value={formData.event_type}
                onChange={e => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
              >
                {EVENT_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white resize-none"
              placeholder="Describe the event..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Event Image (optional)</label>
            <div className="flex mb-2 border border-primary/10 rounded-lg overflow-hidden">
              <button type="button" onClick={() => setEventImageMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all ${eventImageMode === 'upload' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-dark-300/50 text-gray-400 hover:text-gray-300'}`}>
                <Upload className="w-4 h-4" /> Upload
              </button>
              <button type="button" onClick={() => setEventImageMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all ${eventImageMode === 'url' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-dark-300/50 text-gray-400 hover:text-gray-300'}`}>
                <Link className="w-4 h-4" /> URL
              </button>
            </div>
            {eventImageMode === 'upload' ? (
              <div>
                <input ref={eventFileInputRef} type="file" accept="image/*"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleEventFileUpload(f); }}
                  className="hidden" />
                <div onClick={() => eventFileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-cyan-400'); }}
                  onDragLeave={e => { e.currentTarget.classList.remove('border-cyan-400'); }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-cyan-400'); const f = e.dataTransfer.files?.[0]; if (f) handleEventFileUpload(f); }}
                  className="w-full px-4 py-6 bg-dark-300/50 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer hover:border-primary/40 transition-all text-center">
                  {uploadingEventImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-400 text-sm">Processing...</span>
                    </div>
                  ) : formData.image && formData.image.startsWith('data:') ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={formData.image} alt="Uploaded" className="max-h-24 rounded object-cover" />
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
              <input type="url" value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
                placeholder="https://res.cloudinary.com/..." />
            )}
            {formData.image && !formData.image.startsWith('data:') && (
              <div className="mt-2 rounded-lg overflow-hidden border border-primary/10">
                <img src={formData.image} alt="Preview" className="w-full h-24 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Registration Link</label>
              <input
                type="url"
                value={formData.register_link}
                onChange={e => setFormData(prev => ({ ...prev, register_link: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
                placeholder="https://forms.google.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Recap Link</label>
              <input
                type="url"
                value={formData.recap_link}
                onChange={e => setFormData(prev => ({ ...prev, recap_link: e.target.value }))}
                className="w-full px-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
                placeholder="https://..."
              />
            </div>
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
            <span className="text-sm text-gray-300">Featured event</span>
          </div>

          {/* Speakers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Speakers</label>
              <button
                type="button"
                onClick={addSpeaker}
                className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
              >
                + Add Speaker
              </button>
            </div>
            {formData.speakers.map((speaker, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={speaker.name}
                  onChange={e => updateSpeaker(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-dark-300/50 border border-primary/10 rounded-lg text-white text-sm"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={speaker.role}
                  onChange={e => updateSpeaker(index, 'role', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-dark-300/50 border border-primary/10 rounded-lg text-white text-sm"
                  placeholder="Role"
                />
                <button
                  type="button"
                  onClick={() => removeSpeaker(index)}
                  className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold gradient-text">Events Management</h1>
            <p className="text-gray-400 mt-1">Create and manage club events</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-300/50 border border-primary/10 rounded-lg focus:border-primary/30 outline-none text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 self-center mr-1">Status:</span>
            {['All', ...EVENT_STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  filterStatus === s
                    ? s === 'All' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : getStatusColor(s)
                    : 'bg-dark-300/50 text-gray-400 border-primary/10 hover:border-primary/30'
                }`}
              >
                {s}
              </button>
            ))}
            <span className="text-sm text-gray-400 self-center ml-4 mr-1">Type:</span>
            {['All', ...EVENT_TYPES].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  filterType === t
                    ? t === 'All' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : getTypeColor(t) + ' border-primary/20'
                    : 'bg-dark-300/50 text-gray-400 border-primary/10 hover:border-primary/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-gray-400 text-sm">Total Events</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold text-cyan-400">{events.filter(e => e.status === 'Upcoming').length}</p>
            <p className="text-gray-400 text-sm">Upcoming</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold text-green-400">{events.filter(e => e.status === 'Ongoing').length}</p>
            <p className="text-gray-400 text-sm">Ongoing</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-primary/10">
            <p className="text-2xl font-bold">{events.filter(e => e.event_type === 'Workshop').length}</p>
            <p className="text-gray-400 text-sm">Workshops</p>
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="text-gray-400 mt-4">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {events.length === 0 ? 'No events yet' : 'No matching events'}
            </h3>
            <p className="text-gray-500">
              {events.length === 0 ? 'Create your first event to get started.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={extractId(event._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl border border-primary/10 p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      {event.featured && (
                        <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(event.event_type)}`}>
                        {event.event_type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{event.location}</span>
                      </div>
                      {event.speakers && event.speakers.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{event.speakers.length} speaker{event.speakers.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
