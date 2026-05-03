"use client";

import { useEffect } from "react";
import { Mountain, ArrowUp, Clock, Loader as Loader2 } from "lucide-react";
import { difficultyOptions } from "@/constans/options-story";
import { TrailSelect } from "./trail-select";

interface Trail {
  id: string;
  name: string;
  location?: string;
  elevation?: number;
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
  // Auto-fill duration and elevation when trail is selected
  useEffect(() => {
    if (selectedTrail && trails.length > 0) {
      const trail = trails.find((t) => t.id === selectedTrail);
      if (trail) {
        if (trail.estimated_duration && !duration) {
          setDuration(trail.estimated_duration);
        }
        if (trail.elevation && !elevation) {
          setElevation(`${trail.elevation.toLocaleString()} mdpl`);
        }
      }
    }
  }, [selectedTrail, trails, duration, elevation, setDuration, setElevation]);

  return (
    <section className="glass rounded-2xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Trail */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Mountain className="h-4 w-4 text-primary" />
            Trail
          </label>
          {loadingTrails ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-2 px-4 bg-card/50 border border-border rounded-xl">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading trails...
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
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <ArrowUp className="h-4 w-4 text-primary" />
            Difficulty
          </label>
          <div className="flex gap-2">
            {difficultyOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setDifficulty(difficulty === opt.value ? "" : opt.value)
                }
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  difficulty === opt.value
                    ? `${opt.color} bg-card border-current ring-1 ring-current/20`
                    : "text-muted-foreground bg-card/50 border-border hover:border-foreground/20"
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
            className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <ArrowUp className="h-4 w-4 text-primary" />
            Elevation{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={elevation}
            onChange={(e) => setElevation(e.target.value)}
            placeholder="e.g. 3,726 mdpl"
            className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>
    </section>
  );
}
