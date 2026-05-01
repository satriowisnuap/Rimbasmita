"use client";

interface Props {
  content: string;
  setContent: (v: string) => void;
}

export function ContentSection({ content, setContent }: Props) {
  return (
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
  );
}
