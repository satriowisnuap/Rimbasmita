// hooks/navbar/use-navbar.ts
"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Compass, PenLine, Scroll } from "lucide-react";

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
        { href: "/dashboard", label: "Feed", icon: BookOpen },
        { href: "/explore", label: "Explore", icon: Compass },
        { href: "/stories", label: "Stories", icon: Scroll },
        { href: "/create", label: "Write", icon: PenLine },
        { href: "/journal", label: "Journal", icon: BookOpen },
      ]
    : [
        { href: "/explore", label: "Explore", icon: Compass },
        ...(isHome
          ? [{ href: "/stories", label: "Stories", icon: Scroll }]
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
