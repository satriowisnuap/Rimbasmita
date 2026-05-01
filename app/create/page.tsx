'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PenLine, Mountain, Clock, ArrowUp, Eye, EyeOff, Save, SendHorizontal as SendHorizonal, ImagePlus, X, Leaf, Flame, Wind, Loader as Loader2, TriangleAlert as AlertTriangle, Lightbulb, Tag, Plus } from 'lucide-react';

interface Trail {
  id: string;
  name: string;
  location?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const moodOptions = [
  {
    value: 'calm',
    label: 'Calm',
    icon: Leaf,
    description: 'Peaceful & serene',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    activeBg: 'bg-emerald-500/20 border-emerald-500',
  },
  {
    value: 'challenging',
    label: 'Challenging',
    icon: Flame,
    description: 'Tough & rewarding',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10 border-orange-500/30',
    activeBg: 'bg-orange-500/20 border-orange-500',
  },
  {
    value: 'reflective',
    label: 'Reflective',
    icon: Wind,
    description: 'Deep & introspective',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/30',
    activeBg: 'bg-blue-500/20 border-blue-500',
  },
];

const difficultyOptions = [
  { value: 'easy', label: 'Easy', color: 'text-emerald-500' },
  { value: 'medium', label: 'Medium', color: 'text-amber-500' },
  { value: 'hard', label: 'Hard', color: 'text-red-500' },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CreateStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [selectedTrail, setSelectedTrail] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState('');
  const [elevation, setElevation] = useState('');
  const [mood, setMood] = useState('');
  const [content, setContent] = useState('');
  const [tips, setTips] = useState('');
  const [warnings, setWarnings] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Trails data
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(true);

  // Drag state for image upload area
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchTrails() {
      try {
        const { data, error: trailsError } = await supabase
          .from('trails')
          .select('id, name, location')
          .order('name');

        if (trailsError) {
          console.error('Error fetching trails:', trailsError);
        } else {
          setTrails(data || []);
        }
      } catch (err) {
        console.error('Error fetching trails:', err);
      } finally {
        setLoadingTrails(false);
      }
    }

    fetchTrails();
  }, []);

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        handleAddTag();
      }
      if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
        setTags((prev) => prev.slice(0, -1));
      }
    },
    [handleAddTag, tagInput, tags.length]
  );

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }, []);

  const handleAddImageUrl = useCallback(() => {
    const trimmed = imageUrlInput.trim();
    if (trimmed && !imageUrls.includes(trimmed) && imageUrls.length < 5) {
      setImageUrls((prev) => [...prev, trimmed]);
      setImageUrlInput('');
    }
  }, [imageUrlInput, imageUrls]);

  const handleImageUrlKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddImageUrl();
      }
    },
    [handleAddImageUrl]
  );

  const removeImage = useCallback((url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      // For now, we just prompt for a URL since we store URLs
      // In a real implementation, this would upload files
      const url = prompt('Enter image URL:');
      if (url && url.trim() && !imageUrls.includes(url.trim()) && imageUrls.length < 5) {
        setImageUrls((prev) => [...prev, url.trim()]);
      }
    },
    [imageUrls]
  );

  const handleSubmit = async (draft: boolean) => {
    if (!(session?.user as any)?.id) {
      setError('You must be logged in to create a story.');
      return;
    }

    if (!title.trim()) {
      setError('Please add a title for your story.');
      return;
    }

    if (!content.trim()) {
      setError('Please write some content for your story.');
      return;
    }

    setIsDraft(draft);
    setIsSubmitting(true);
    setError('');

    const slug = generateSlug(title);

    try {
      const { data, error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: (session!.user as any).id,
          title: title.trim(),
          slug,
          content: content.trim(),
          excerpt: content.trim().substring(0, 200),
          trail_id: selectedTrail || null,
          difficulty: difficulty || null,
          duration: duration.trim() || null,
          elevation: elevation.trim() || null,
          mood: mood || null,
          tips: tips.trim() || null,
          warnings: warnings.trim() || null,
          is_private: isPrivate,
          is_draft: draft,
        })
        .select()
        .single();

      if (insertError) {
        // Handle duplicate slug
        if (insertError.code === '23505') {
          setError('A story with a similar title already exists. Please try a different title.');
        } else {
          setError(`Failed to create story: ${insertError.message}`);
        }
        setIsSubmitting(false);
        return;
      }

      const storyId = data.id;

      // Insert tags
      if (tags.length > 0) {
        const tagInserts = tags.map((tag) => ({
          story_id: storyId,
          tag,
        }));

        const { error: tagsError } = await supabase.from('story_tags').insert(tagInserts);

        if (tagsError) {
          console.error('Error inserting tags:', tagsError);
        }
      }

      // Insert images
      if (imageUrls.length > 0) {
        const imageInserts = imageUrls.map((url, index) => ({
          story_id: storyId,
          image_url: url,
          display_order: index,
        }));

        const { error: imagesError } = await supabase.from('story_images').insert(imageInserts);

        if (imagesError) {
          console.error('Error inserting images:', imagesError);
        }
      }

      router.push(`/story/${slug}`);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <PenLine className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Write Your Story</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Share your journey
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Every step on the trail has a story worth telling. Take your time and write from the heart.
            </p>
          </motion.div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 px-5 py-4 flex items-start gap-3"
              >
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive leading-relaxed">{error}</p>
                <button onClick={() => setError('')} className="ml-auto shrink-0">
                  <X className="h-4 w-4 text-destructive/60 hover:text-destructive transition-colors" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Title */}
            <section className="glass rounded-2xl p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Story Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Finding Peace on Rinjani's Summit"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-lg font-semibold"
                maxLength={200}
              />
              {title && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground mt-2"
                >
                  Slug preview: <span className="text-foreground/70 font-mono">{generateSlug(title)}</span>
                </motion.p>
              )}
            </section>

            {/* Trail & Difficulty */}
            <section className="glass rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Trail Selector */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Mountain className="h-4 w-4 text-primary" />
                    Trail
                  </label>
                  {loadingTrails ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading trails...
                    </div>
                  ) : (
                    <select
                      value={selectedTrail}
                      onChange={(e) => setSelectedTrail(e.target.value)}
                      className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a trail (optional)</option>
                      {trails.map((trail) => (
                        <option key={trail.id} value={trail.id}>
                          {trail.name}{trail.location ? ` - ${trail.location}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <ArrowUp className="h-4 w-4 text-primary" />
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    {difficultyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDifficulty(difficulty === opt.value ? '' : opt.value)}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          difficulty === opt.value
                            ? `${opt.color} bg-card border-current ring-1 ring-current/20`
                            : 'text-muted-foreground bg-card/50 border-border hover:border-foreground/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration & Elevation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 days, 8 hours"
                    className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <ArrowUp className="h-4 w-4 text-primary" />
                    Elevation <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    placeholder="e.g. 3,726 mdpl"
                    className="w-full bg-card/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Mood */}
            <section className="glass rounded-2xl p-6">
              <label className="block text-sm font-medium text-foreground mb-4">
                How did this journey feel?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {moodOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = mood === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMood(isActive ? '' : opt.value)}
                      className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all duration-300 ${
                        isActive ? opt.activeBg : `${opt.bg} hover:scale-[1.02]`
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${opt.color}`} />
                      <span className={`text-sm font-semibold ${isActive ? opt.color : 'text-foreground'}`}>
                        {opt.label}
                      </span>
                      <span className={`text-xs ${isActive ? opt.color : 'text-muted-foreground'}`}>
                        {opt.description}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="mood-indicator"
                          className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-current"
                          style={{ color: `var(--tw-${opt.color.replace('text-', '')})` }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Story Content */}
            <section className="glass rounded-2xl p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Story
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell the story of your journey... What did you see? How did you feel? What moments stuck with you?"
                rows={12}
                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {content.length} characters
                {content.length > 0 && (
                  <span> &middot; Excerpt will be: {content.substring(0, 60)}...</span>
                )}
              </p>
            </section>

            {/* Tips & Warnings */}
            <section className="glass rounded-2xl p-6 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Tips for Fellow Hikers
                </label>
                <textarea
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  placeholder="Share practical tips: what to bring, best time to go, things you wish you knew..."
                  rows={4}
                  className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y leading-relaxed"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Warnings
                </label>
                <textarea
                  value={warnings}
                  onChange={(e) => setWarnings(e.target.value)}
                  placeholder="Any safety warnings or important things to watch out for..."
                  rows={4}
                  className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y leading-relaxed"
                />
              </div>
            </section>

            {/* Tags */}
            <section className="glass rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Tag className="h-4 w-4 text-primary" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag and press Enter..."
                  className="flex-1 bg-card/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.includes(tagInput.trim().toLowerCase()) || tags.length >= 10}
                  className="px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Up to 10 tags. Press Enter or comma to add.
              </p>
            </section>

            {/* Image Upload */}
            <section className="glass rounded-2xl p-6">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <ImagePlus className="h-4 w-4 text-primary" />
                Images
              </label>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : 'border-border hover:border-primary/40 hover:bg-card/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={() => {
                    // For now, prompt for URL since we store URLs
                    const url = prompt('Enter image URL:');
                    if (url && url.trim() && !imageUrls.includes(url.trim()) && imageUrls.length < 5) {
                      setImageUrls((prev) => [...prev, url.trim()]);
                    }
                  }}
                />
                <ImagePlus className={`h-8 w-8 mx-auto mb-3 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground/60'}`} />
                <p className={`text-sm font-medium ${isDragging ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isDragging ? 'Drop images here' : 'Drag & drop images or click to add'}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Up to 5 images. Add image URLs for now.
                </p>
              </div>

              {/* URL Input */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={handleImageUrlKeyDown}
                  placeholder="Paste an image URL..."
                  className="flex-1 bg-card/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput.trim() || imageUrls.includes(imageUrlInput.trim()) || imageUrls.length >= 5}
                  className="px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Image Previews */}
              <AnimatePresence>
                {imageUrls.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
                  >
                    {imageUrls.map((url) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group rounded-xl overflow-hidden border border-border aspect-video"
                      >
                        <img
                          src={url}
                          alt="Story image"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '';
                            (e.target as HTMLImageElement).alt = 'Failed to load';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Privacy Toggle & Actions */}
            <section className="glass rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Privacy Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                      isPrivate ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center"
                      animate={{ left: isPrivate ? 'auto' : 2, right: isPrivate ? 2 : 'auto' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      {isPrivate ? (
                        <EyeOff className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </motion.div>
                  </button>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isPrivate ? 'Private' : 'Public'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isPrivate
                        ? 'Only you can see this story'
                        : 'Visible to the community'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none"
                  >
                    {isSubmitting && isDraft ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none"
                  >
                    {isSubmitting && !isDraft ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizonal className="h-4 w-4" />
                    )}
                    Publish
                  </button>
                </div>
              </div>
            </section>
          </motion.div>

          {/* Bottom spacing */}
          <div className="h-8" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
