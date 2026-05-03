"use client";

import Link from "next/link";
import { Globe, FileText, PenLine } from "lucide-react";
import { TabKey } from "@/constans/journal-config";

interface Props {
  activeTab: TabKey;
}

export function JournalEmptyState({ activeTab }: Props) {
  if (activeTab === "terbit") {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Belum ada cerita terbit
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
          Semua cerita yang telah kamu publikasikan (publik maupun pribadi) akan muncul di sini.
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
        >
          <PenLine className="h-4 w-4" />
          Tulis Cerita Pertama
        </Link>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-12 text-center">
      <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Belum ada draf
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        Draf ceritamu yang belum diterbitkan akan muncul di sini. Simpan cerita
        sebagai draf untuk melanjutkannya nanti.
      </p>
      <Link
        href="/create"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
      >
        <PenLine className="h-4 w-4" />
        Mulai Menulis
      </Link>
    </div>
  );
}
