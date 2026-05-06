"use client";

import { TriangleAlert as AlertTriangle, Lightbulb } from "lucide-react";

interface Props {
  tips: string;
  setTips: (v: string) => void;
  warnings: string;
  setWarnings: (v: string) => void;
}

export function TipsWarningsSection({
  tips,
  setTips,
  warnings,
  setWarnings,
}: Props) {
  return (
    <section className="glass rounded-2xl p-6 space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Tips untuk Pendaki Lain
        </label>

        <textarea
          value={tips}
          onChange={(e) => setTips(e.target.value)}
          placeholder="Bagikan tips praktis: barang yang perlu dibawa, waktu terbaik untuk mendaki, atau hal-hal yang seandainya kamu tahu sebelumnya..."
          rows={4}
          className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y leading-relaxed"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Peringatan
        </label>

        <textarea
          value={warnings}
          onChange={(e) => setWarnings(e.target.value)}
          placeholder="Tuliskan peringatan keselamatan atau hal penting yang perlu diperhatikan selama pendakian..."
          rows={4}
          className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y leading-relaxed"
        />
      </div>
    </section>
  );
}
