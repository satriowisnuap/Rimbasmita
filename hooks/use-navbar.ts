"use client";

import { BookOpen, Compass, PenLine, Scroll } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useNavbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const user = session?.user;
  const username = session?.user?.username;

  // Fetch profile image from database for the most up-to-date value
  useEffect(() => {
    if (user?.email) {
      const fetchProfile = async () => {
        try {
          const { supabase } = await import("@/lib/supabase");

          const { data } = await supabase
            .from("profiles")
            .select("image")
            .eq("email", user.email!.toLowerCase())
            .single();

          if (data?.image) {
            setProfileImage(data.image);
          }
        } catch (error) {
          console.error("Error fetching profile image in navbar:", error);
        }
      };
      fetchProfile();
    }
  }, [user?.email]);

  // Route state
  const isDashboard = pathname.startsWith("/dashboard");
  const isProfile = pathname.startsWith("/profile");
  const isHome = pathname === "/";

  // Guest navbar visibility
  const showStoriesNav =
    isHome ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/stories");

  // Navbar links
  const navLinks = user
    ? [
        {
          href: "/dashboard",
          label: "Beranda",
          icon: BookOpen,
        },
        {
          href: "/explore",
          label: "Jelajahi",
          icon: Compass,
        },
        {
          href: "/stories",
          label: "Cerita",
          icon: Scroll,
        },
        {
          href: "/create",
          label: "Tulis",
          icon: PenLine,
        },
        {
          href: "/journal",
          label: "Jurnal",
          icon: BookOpen,
        },
      ]
    : [
        {
          href: "/explore",
          label: "Jelajahi",
          icon: Compass,
        },

        ...(showStoriesNav
          ? [
              {
                href: "/stories",
                label: "Cerita",
                icon: Scroll,
              },
            ]
          : []),
      ];

  // Theme toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Auth actions
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  return {
    user,
    username,
    profileImage,

    theme,
    toggleTheme,

    pathname,
    isDashboard,
    isProfile,
    isHome,

    navLinks,

    mobileMenuOpen,
    setMobileMenuOpen,

    searchOpen,
    setSearchOpen,

    handleLogout,
    handleSignIn,
  };
}
