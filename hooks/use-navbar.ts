// hooks/navbar/use-navbar.ts
"use client";

import { BookOpen, Compass, PenLine, Scroll } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function useNavbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const user = session?.user;
  const username = session?.user?.username;
  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname.startsWith("/profile");
  const isHome = pathname === "/";

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Beranda", icon: BookOpen },
        { href: "/explore", label: "Jelajahi", icon: Compass },
        { href: "/stories", label: "Cerita", icon: Scroll },
        { href: "/create", label: "Tulis", icon: PenLine },
        { href: "/journal", label: "Jurnal", icon: BookOpen },
      ]
    : [
        { href: "/explore", label: "Jelajahi", icon: Compass },
        ...(isHome
          ? [{ href: "/stories", label: "Cerita", icon: Scroll }]
          : []),
      ];

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleSignIn = () => router.push("/auth/signin");

  return {
    user,
    username,
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
    handleSignIn,
  };
}
