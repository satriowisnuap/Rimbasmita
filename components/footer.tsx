"use client";

import { Heart, Mountain } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Footer() {
  const { data: session } = useSession();

  const isLoggedIn = !!session?.user;

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-primary" />

              <span className="text-lg font-bold text-foreground">
                Rimbasmita
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Tempat berbagi cerita dan pengalaman mendaki yang bermakna. Setiap
              langkah di gunung punya cerita yang layak diceritakan.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Jelajahi
            </h4>

            <ul className="space-y-2">
              <li>
                <Link
                  href="/explore"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Jalur Pendakian
                </Link>
              </li>

              <li>
                <Link
                  href="/stories"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cerita Terbaru
                </Link>
              </li>

              <li>
                <Link
                  href={isLoggedIn ? "/journal" : "/auth/signin"}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Jurnal Pribadi
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Komunitas
            </h4>

            <ul className="space-y-2">
              <li>
                <Link
                  href={isLoggedIn ? "/create" : "/auth/signin"}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tulis Cerita
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Rimbasmita. Dibuat dengan{" "}
            <Heart className="inline h-3 w-3 text-primary" /> untuk pecinta
            alam.
          </p>
        </div>
      </div>
    </footer>
  );
}
