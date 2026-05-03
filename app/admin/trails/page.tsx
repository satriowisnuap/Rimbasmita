"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Mountain,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  MapPin,
  ArrowUp,
  Clock,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Shield,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface Trail {
  id: string;
  name: string;
  location: string;
  region: string | null;
  elevation: number;
  difficulty: string;
  estimated_duration: string | null;
  description: string | null;
  image: string | null;
}

const emptyForm = {
  name: "",
  location: "",
  region: "",
  elevation: "",
  difficulty: "medium",
  estimated_duration: "",
  description: "",
  image: "",
};

const difficultyOptions = [
  { value: "easy", label: "Mudah", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "medium", label: "Sedang", color: "bg-amber-500/20 text-amber-400" },
  { value: "hard", label: "Sulit", color: "bg-red-500/20 text-red-400" },
];

const difficultyColor: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

type SortKey = "name" | "elevation" | "difficulty";

export default function AdminTrailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [imgError, setImgError] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Trail | null>(null);
  const [deleting, setDeleting] = useState(false);

  // --- Auth guard ---
  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (!session || role !== "admin") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // --- Fetch trails ---
  const fetchTrails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trails");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setTrails(data.trails ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrails();
  }, [fetchTrails]);

  // --- Filtered + sorted ---
  const displayed = trails
    .filter((t) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        (t.region ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let va: any = a[sortKey];
      let vb: any = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

  // --- Sort toggle ---
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
    ) : (
      <ChevronUp className="h-3 w-3 opacity-30" />
    );

  // --- Open modal ---
  const openCreate = () => {
    setEditingTrail(null);
    setForm(emptyForm);
    setFormError("");
    setImgError(false);
    setModalOpen(true);
  };

  const openEdit = (trail: Trail) => {
    setEditingTrail(trail);
    setForm({
      name: trail.name,
      location: trail.location,
      region: trail.region ?? "",
      elevation: String(trail.elevation),
      difficulty: trail.difficulty,
      estimated_duration: trail.estimated_duration ?? "",
      description: trail.description ?? "",
      image: trail.image ?? "",
    });
    setFormError("");
    setImgError(false);
    setModalOpen(true);
  };

  // --- Save ---
  const handleSave = async () => {
    if (!form.name.trim() || !form.location.trim()) {
      setFormError("Nama dan lokasi wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const url = editingTrail
        ? `/api/admin/trails/${editingTrail.id}`
        : "/api/admin/trails";
      const method = editingTrail ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          elevation: form.elevation ? Number(form.elevation) : 0,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setFormError(d.error || "Gagal menyimpan.");
        return;
      }
      setModalOpen(false);
      fetchTrails();
    } catch {
      setFormError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  // --- Delete ---
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/trails/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchTrails();
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || (session && (session.user as any)?.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-3">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Manajemen Jalur
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {trails.length} jalur tersedia dalam database
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Tambah Jalur
            </motion.button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-3 flex items-center gap-3 mb-6 max-w-md"
          >
            <Search className="h-4 w-4 text-muted-foreground ml-1 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari nama, lokasi, wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border/50 bg-accent/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <button className="flex items-center gap-1 text-left hover:text-foreground transition-colors" onClick={() => toggleSort("name")}>
                Nama Jalur <SortIcon k="name" />
              </button>
              <span>Lokasi</span>
              <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("difficulty")}>
                Kesulitan <SortIcon k="difficulty" />
              </button>
              <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("elevation")}>
                Elevasi <SortIcon k="elevation" />
              </button>
              <span>Estimasi</span>
              <span>Aksi</span>
            </div>

            {/* Rows */}
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="h-7 w-7 text-primary animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Memuat data...</p>
              </div>
            ) : displayed.length === 0 ? (
              <div className="py-20 text-center">
                <Mountain className="h-10 w-10 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  {searchQuery ? "Tidak ada jalur ditemukan." : "Belum ada jalur. Tambahkan yang pertama!"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {displayed.map((trail, i) => (
                  <motion.div
                    key={trail.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-accent/20 transition-colors group"
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mountain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{trail.name}</p>
                        {trail.region && (
                          <p className="text-[10px] text-muted-foreground truncate">{trail.region}</p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                      <span className="truncate">{trail.location}</span>
                    </div>

                    {/* Difficulty */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border w-fit ${difficultyColor[trail.difficulty] ?? "bg-muted/50 text-muted-foreground border-border/50"}`}>
                      {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
                    </span>

                    {/* Elevation */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ArrowUp className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                      <span>{trail.elevation.toLocaleString("id-ID")} mdpl</span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {trail.estimated_duration ? (
                        <>
                          <Clock className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                          <span className="truncate">{trail.estimated_duration}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEdit(trail)}
                        className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteTarget(trail)}
                        className="p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* ===== CREATE / EDIT MODAL ===== */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-2xl rounded-[32px] shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {editingTrail ? "Edit Jalur" : "Tambah Jalur Baru"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {editingTrail ? `Mengedit: ${editingTrail.name}` : "Isi informasi jalur pendakian"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Nama Jalur *">
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="contoh: Gunung Rinjani"
                      className="input-field"
                    />
                  </FormField>
                  <FormField label="Lokasi *">
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="contoh: Lombok, NTB"
                      className="input-field"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Wilayah / Provinsi">
                    <input
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      placeholder="contoh: Nusa Tenggara Barat"
                      className="input-field"
                    />
                  </FormField>
                  <FormField label="Ketinggian (mdpl)">
                    <input
                      type="number"
                      value={form.elevation}
                      onChange={(e) => setForm({ ...form, elevation: e.target.value })}
                      placeholder="contoh: 3726"
                      className="input-field"
                      min={0}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Tingkat Kesulitan">
                    <div className="flex gap-2 flex-wrap">
                      {difficultyOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setForm({ ...form, difficulty: opt.value })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            form.difficulty === opt.value
                              ? opt.color + " ring-2 ring-current"
                              : "glass text-muted-foreground hover:bg-accent/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="Estimasi Durasi">
                    <input
                      value={form.estimated_duration}
                      onChange={(e) => setForm({ ...form, estimated_duration: e.target.value })}
                      placeholder="contoh: 2-3 hari"
                      className="input-field"
                    />
                  </FormField>
                </div>

                <FormField label="URL Gambar">
                  <input
                    value={form.image}
                    onChange={(e) => {
                      setForm({ ...form, image: e.target.value });
                      setImgError(false);
                    }}
                    placeholder="https://..."
                    className="input-field"
                  />
                  {/* Live preview using next/image */}
                  {form.image && !imgError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 relative w-full h-44 rounded-xl overflow-hidden border border-border/40 bg-accent/20"
                    >
                      <Image
                        src={form.image}
                        alt="Preview gambar jalur"
                        fill
                        sizes="(max-width: 672px) 100vw, 672px"
                        className="object-cover"
                        onError={() => setImgError(true)}
                        unoptimized={false}
                      />
                    </motion.div>
                  )}
                  {form.image && imgError && (
                    <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      URL gambar tidak valid atau tidak dapat dimuat.
                    </p>
                  )}
                </FormField>

                <FormField label="Deskripsi">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Tulis deskripsi singkat tentang jalur ini..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </FormField>

                {formError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {formError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-5 py-3 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all"
                  >
                    Batal
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving ? "Menyimpan..." : "Simpan"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DELETE CONFIRM MODAL ===== */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-sm rounded-3xl shadow-2xl p-7 text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Hapus Jalur?</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Jalur <span className="font-semibold text-foreground">"{deleteTarget.name}"</span> akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl glass text-sm font-medium hover:bg-accent/50 transition-all"
                >
                  Batal
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  {deleting ? "Menghapus..." : "Hapus"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Shared input styles via global */}
      <style jsx global>{`
        .input-field {
          width: 100%;
          background: hsl(var(--background) / 0.5);
          border: 1px solid hsl(var(--border) / 0.5);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field::placeholder { color: hsl(var(--muted-foreground)); }
        .input-field:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
        }
      `}</style>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
