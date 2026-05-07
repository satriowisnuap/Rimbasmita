import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔥 GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    // 🔥 LOGIN EMAIL & PASSWORD
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email dan password wajib diisi");
          }

          const email = credentials.email.toLowerCase();

          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();

          if (error || !data) {
            throw new Error("Email atau password salah");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            data.password,
          );

          if (!isValid) {
            throw new Error("Email atau password salah");
          }

          if (!data.email_verified) {
            throw new Error("Email belum diverifikasi");
          }

          return {
            id: data.id,
            email: data.email,
            name: data.username || "User",
            username: data.username,
            image: data.image,
          };
        } catch (err: any) {
          throw new Error(err.message || "Login gagal");
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 🔥 HANDLE GOOGLE LOGIN / REGISTER
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        if (!email) return false;

        // 🔥 ambil state dari OAuth
        const isRegister = account?.state === "register";

        const { data: existingUser } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        // ❌ kalau register tapi sudah ada
        if (isRegister && existingUser) {
          throw new Error("Email sudah terdaftar, silakan login");
        }

        // 🔥 kalau belum ada → insert
        if (!existingUser) {
          const username = email.split("@")[0];

          await supabase.from("profiles").insert({
            email,
            username,
            name: user.name || username,
            image: user.image || null,
            email_verified: true,
            password: null,
          });
        }

        return true;
      }

      return true;
    },

    // 🔥 JWT
    async jwt({ token, user }) {
      // 🔥 saat login pertama
      if (user?.email) {
        const { data } = await supabase
          .from("profiles")
          .select("id, username, role, image")
          .eq("email", user.email.toLowerCase())
          .single();

        if (data) {
          token.id = data.id;
          token.username = data.username;
          token.role = data.role;
          token.image = data.image;
        }
      }

      return token;
    },

    // 🔥 SESSION
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id ?? null;
        (session.user as any).username = token.username ?? null;
        (session.user as any).role = token.role ?? null;
        (session.user as any).image = token.image ?? null;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
