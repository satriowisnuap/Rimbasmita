"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import {
  Mountain,
  Sun,
  Moon,
  Search,
  Bell,
  BookOpen,
  Compass,
  PenLine,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useDashboard } from "@/hooks/dashboard/use-dashboard";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname.startsWith("/profile");
  const { username } = useDashboard();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // CEK USER SUPABASE
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Feed", icon: BookOpen },
        { href: "/explore", label: "Explore", icon: Compass },
        { href: "/create", label: "Write", icon: PenLine },
        { href: "/journal", label: "Journal", icon: BookOpen },
      ]
    : [{ href: "/explore", label: "Explore", icon: Compass }];

  // HANDLE LOGOUT SUPABASE
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center gap-2 group"
            >
              <Mountain className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Rimbasmita
              </span>
            </Link>

            {/* Desktop Nav */}
            {!isDashboard && !isProfile && (
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
            )}

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {!isDashboard && !isProfile && (
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
                  {user && username && !isProfile && !isDashboard && (
                    <Link
                      href={`/profile/${username}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-accent/50 transition-all duration-300"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata?.name || ""}
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
                  onClick={() => signIn("google")}
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
            onClick={() => setSearchOpen(false)}
          >
            <div
              className="max-w-2xl mx-auto pt-24 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Cari cerita, jalur, atau penulis..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Ketik untuk mulai mencari...
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
