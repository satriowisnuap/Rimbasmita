"use client";

interface Props {
  content: string;
  setContent: (v: string) => void;
}

export function ContentSection({ content, setContent }: Props) {
  return (
    <section className="glass rounded-2xl p-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        Ceritamu
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ceritakan perjalananmu... Apa yang kamu lihat? Apa yang kamu rasakan? Momen apa yang paling berkesan?"
        rows={12}
        className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y leading-relaxed"
      />
      <p className="text-xs text-muted-foreground mt-2">
        {content.length} karakter
        {content.length > 0 && (
          <span> &middot; Kutipan: {content.substring(0, 60)}...</span>
        )}
      </p>
    </section>
  );
}
