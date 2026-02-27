"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { blogsAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Edit3, Send, ImageIcon } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Robotics", "AI & ML", "Electronics", "Programming", "IoT", "3D Printing", "Tutorial", "Project Showcase", "Other"];

export default function WriteBlogPage() {
  const { user, token } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Upload cover image (base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!token || !user) {
      toast.error("You must be logged in to publish a blog");
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSubmitting(true);
    try {
      const result = await blogsAPI.create(token, {
        title: title.trim(),
        description: description.trim() || title.trim(),
        content: content,
        image_url: imageUrl || undefined,
        category: category || undefined,
      });
      toast.success("Blog published successfully!");
      router.push(`/blogpost/${result.slug}`);
    } catch (err: any) {
      console.error("Failed to publish blog:", err);
      toast.error(`Failed to publish: ${err?.message || "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Login Required</h2>
          <p className="text-gray-400">You need to be logged in to write a blog post.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:opacity-90">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#111] text-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Blogs</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                preview ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-zinc-800 text-gray-300 border border-zinc-700"
              }`}
            >
              {preview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {preview ? "Edit" : "Preview"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {!preview ? (
          /* --- EDITOR --- */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title..."
              className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600"
            />

            {/* Description */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (optional)..."
              className="w-full text-lg bg-transparent border-none outline-none text-gray-400 placeholder-gray-600"
            />

            {/* Category + Image row */}
            <div className="flex flex-wrap gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-400 text-sm"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-gray-300 hover:border-cyan-400 cursor-pointer text-sm transition-colors">
                <ImageIcon className="w-4 h-4" />
                {imageUrl ? "Change cover" : "Add cover image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Cover image preview */}
            {imageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Cover" className="w-full h-48 sm:h-64 object-cover" />
                <button
                  onClick={() => setImageUrl("")}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-gray-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Markdown content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-500">Content (Markdown supported)</label>
                <a 
                  href="https://www.markdownguide.org/basic-syntax/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Markdown guide ↗
                </a>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here using Markdown...

## Getting Started
Your amazing content goes here...

```python
print('Hello IRIS!')
```"
                rows={25}
                className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400 resize-y font-mono text-sm leading-relaxed"
              />
            </div>
          </motion.div>
        ) : (
          /* --- PREVIEW --- */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8"
          >
            {imageUrl && (
              <div className="rounded-xl overflow-hidden mb-6 border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Cover" className="w-full h-48 sm:h-72 object-cover" />
              </div>
            )}

            {category && (
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-4 border border-cyan-500/20">
                {category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {title || "Untitled"}
            </h1>
            
            {description && (
              <p className="italic text-zinc-400 border-l-4 border-blue-600 pl-4 mb-6 text-base">
                &quot;{description}&quot;
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-zinc-500 mb-6">
              <span className="border border-zinc-700 text-zinc-400 bg-zinc-800/70 px-3 py-1 rounded-md">
                By {user.full_name || user.username}
              </span>
              <span className="text-zinc-500">{new Date().toLocaleDateString()}</span>
            </div>

            <hr className="border-zinc-800 mb-6" />

            {/* Simple markdown preview - renders raw text with basic formatting */}
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {content || "No content yet..."}
            </div>
          </motion.div>
        )}

        {/* Writing tips */}
        {!preview && (
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-sm text-gray-400">
            <p className="font-medium text-cyan-400 mb-2">💡 Writing Tips</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use <code className="text-cyan-300 bg-zinc-800 px-1 rounded">## Headings</code> to organize your content</li>
              <li>Add images with <code className="text-cyan-300 bg-zinc-800 px-1 rounded">![alt](url)</code></li>
              <li>Format code with triple backticks and language name</li>
              <li>Use <code className="text-cyan-300 bg-zinc-800 px-1 rounded">**bold**</code> and <code className="text-cyan-300 bg-zinc-800 px-1 rounded">*italic*</code> for emphasis</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
