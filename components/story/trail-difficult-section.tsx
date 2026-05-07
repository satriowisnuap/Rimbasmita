"use client";

import { difficultyOptions } from "@/constans/options-story";
import {
  ArrowUp,
  Clock,
  Loader as Loader2,
  Lock,
  Mountain,
} from "lucide-react";
import { useEffect } from "react";
import { TrailSelect } from "./trail-select";

interface Trail {
  id: string;
  name: string;
  location?: string;
  elevation?: number;
  difficulty?: string | null;
  estimated_duration?: string | null;
}

interface Props {
  trails: Trail[];
  loadingTrails: boolean;
  selectedTrail: string;
  setSelectedTrail: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  elevation: string;
  setElevation: (v: string) => void;
}

export function TrailDifficultySection({
  trails,
  loadingTrails,
  selectedTrail,
  setSelectedTrail,
  difficulty,
  setDifficulty,
  duration,
  setDuration,
  elevation,
  setElevation,
}: Props) {
  // Auto-fill duration, elevation, and difficulty when trail is selected
  useEffect(() => {
    if (selectedTrail && trails.length > 0) {
      const trail = trails.find((t) => t.id === selectedTrail);

      if (trail) {
        if (trail.estimated_duration) {
          setDuration(
            trail.estimated_duration
              .replace(/days?/gi, "hari")
              .replace(/hours?/gi, "jam"),
          );
        }

        if (trail.elevation) {
          setElevation(`${trail.elevation.toLocaleString()} mdpl`);
        }

        if (trail.difficulty) {
          setDifficulty(trail.difficulty.toLowerCase());
        }
      }
    }
  }, [selectedTrail, trails, setDuration, setElevation, setDifficulty]);

  const isReadOnly = !!selectedTrail;

  return (
    <section className="glass rounded-2xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Trail */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Mountain className="h-4 w-4 text-primary" />
            Jalur Pendakian
          </label>

          {loadingTrails ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-2 px-4 bg-card/50 border border-border rounded-xl">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat jalur...
            </div>
          ) : (
            <TrailSelect
              trails={trails}
              value={selectedTrail}
              onValueChange={setSelectedTrail}
            />
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-primary" />
              Tingkat Kesulitan
            </div>

            {isReadOnly && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border">
                <Lock className="h-2.5 w-2.5" />
                Terhubung ke Jalur
              </span>
            )}
          </label>

          <div className="flex gap-2">
            {difficultyOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={isReadOnly}
                onClick={() =>
                  setDifficulty(difficulty === opt.value ? "" : opt.value)
                }
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  difficulty === opt.value
                    ? `${opt.color} bg-card border-current ring-1 ring-current/20`
                    : "text-muted-foreground bg-card/50 border-border hover:border-foreground/20"
                } ${
                  isReadOnly && difficulty !== opt.value
                    ? "opacity-40 grayscale-[0.5]"
                    : ""
                }`}
              >
                <span
                  className={difficulty === opt.value ? opt.color : undefined}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Duration & Elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Durasi
            </div>

            {isReadOnly && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border">
                <Lock className="h-2.5 w-2.5" />
                Hanya Baca
              </span>
            )}
          </label>

          <input
            type="text"
            value={duration}
            readOnly={isReadOnly}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="contoh: 3 hari"
            className={`w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all ${
              isReadOnly
                ? "cursor-default opacity-80 focus:ring-0"
                : "focus:ring-2 focus:ring-primary/30"
            }`}
          />
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
            <div className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-primary" />
              Ketinggian
            </div>

            {isReadOnly && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border">
                <Lock className="h-2.5 w-2.5" />
                Hanya Baca
              </span>
            )}
          </label>

          <input
            type="text"
            value={elevation}
            readOnly={isReadOnly}
            onChange={(e) => setElevation(e.target.value)}
            placeholder="contoh: 3.726 mdpl"
            className={`w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all ${
              isReadOnly
                ? "cursor-default opacity-80 focus:ring-0"
                : "focus:ring-2 focus:ring-primary/30"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
