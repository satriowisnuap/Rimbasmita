import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

      // 🔥 FIX PALING PENTING (mapping id dari Google)
      profile(profile) {
        return {
          id: profile.sub, // ✅ WAJIB
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
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
      // 🔥 Saat login pertama
      if (user) {
        token.id = user.id ?? token.sub ?? null;

        // username fallback dari email
        token.username = user.email?.split("@")[0] || token.username || "user";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // ✅ inject id ke session
        (session.user as any).id = token.id ?? null;

        // ✅ inject username
        (session.user as any).username = token.username ?? null;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
