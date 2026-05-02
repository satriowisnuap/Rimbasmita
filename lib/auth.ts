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
    // 🔥 GOOGLE LOGIN (TETAP)
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

    // 🔥 TAMBAHAN: LOGIN EMAIL & PASSWORD
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

          // 🔍 ambil user dari database
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();

          if (error || !data) {
            throw new Error("Email atau password salah");
          }

          // 🔐 cek password
          const isValid = await bcrypt.compare(
            credentials.password,
            data.password,
          );

          if (!isValid) {
            throw new Error("Email atau password salah");
          }

          // 🔒 optional: cek verifikasi email
          if (!data.email_verified) {
            throw new Error("Email belum diverifikasi");
          }

          // ✅ RETURN USER (WAJIB)
          return {
            id: data.id,
            email: data.email,
            name: data.username || "User",
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? null;
        token.username = user.email?.split("@")[0] || token.username || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id ?? null;
        (session.user as any).username = token.username ?? null;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
