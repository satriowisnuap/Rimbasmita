"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mountain,
  Sun,
  Moon,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavbar } from "@/hooks/use-navbar";
import { useRouter } from "next/navigation";

export function Navbar() {
  const {
    user,
    username,
    profileImage,
    theme,
    isDashboard,
    isProfile,
    isHome,
    navLinks,
    mobileMenuOpen,
    searchOpen,
    setMobileMenuOpen,
    setSearchOpen,
    toggleTheme,
    handleLogout,
  } = useNavbar();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    stories: any[];
    trails: any[];
    authors: any[];
  }>({ stories: [], trails: [], authors: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => setMounted(true), []);
  const router = useRouter();

  // Search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}`,
          );
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ stories: [], trails: [], authors: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Mountain className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Rimbasmita
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search Button - Show if logged in OR on homepage */}
              {(user || isHome) && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}

              {user ? (
                <>
                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 relative"
                  >
                    <Bell className="h-5 w-5" />
                  </Link>

                  {/* Profile */}
                  {username && (
                    <Link
                      href={`/profile/${username}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent/50 transition-all duration-300"
                    >
                      {profileImage || user?.image ? (
                        <Image
                          src={profileImage || user?.image!}
                          alt={user.name || ""}
                          width={28}
                          height={28}
                          className="rounded-full object-cover ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="hidden md:flex p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-300"
                >
                  Masuk
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong md:hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          >
            <div
              className="max-w-2xl mx-auto pt-24 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl p-4 shadow-2xl border-primary/10">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-primary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari cerita, jalur, atau penulis..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-border max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {isSearching ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Mencari...
                    </div>
                  ) : searchQuery.length < 2 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      Ketik minimal 2 karakter untuk mulai mencari...
                    </p>
                  ) : searchResults.stories.length === 0 &&
                    searchResults.trails.length === 0 &&
                    searchResults.authors.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      Tidak ada hasil ditemukan untuk "{searchQuery}"
                    </p>
                  ) : (
                    <div className="space-y-6 py-2">
                      {/* Stories */}
                      {searchResults.stories.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Stories
                          </h4>
                          <div className="space-y-1">
                            {searchResults.stories.map((s) => (
                              <Link
                                key={s.id}
                                href={`/story/${s.slug}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors group"
                              >
                                <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                  {s.story_images?.[0] ? (
                                    <img
                                      src={s.story_images[0].image_url}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                      <Mountain className="h-5 w-5 text-muted-foreground/40" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                    {s.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    oleh {s.profiles?.name}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trails */}
                      {searchResults.trails.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Jalur
                          </h4>
                          <div className="space-y-1">
                            {searchResults.trails.map((t) => (
                              <Link
                                key={t.id}
                                href={`/explore?q=${t.name}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors group"
                              >
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <Mountain className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground line-clamp-1">
                                    {t.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {t.location}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Authors */}
                      {searchResults.authors.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Penulis
                          </h4>
                          <div className="space-y-1">
                            {searchResults.authors.map((a) => (
                              <Link
                                key={a.id}
                                href={`/profile/${a.username}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors group"
                              >
                                {a.image ? (
                                  <img
                                    src={a.image}
                                    alt=""
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                    {a.name?.[0]}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground line-clamp-1">
                                    {a.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    @{a.username}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
