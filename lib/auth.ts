import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
      // ⚠️ Jangan asumsi user.id selalu ada
      if (user) {
        token.id = user.id ?? token.sub ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      // ⚠️ Pastikan user ada dulu
      if (session.user) {
        (session.user as any).id = token.id ?? null;
      }
      return session;
    },
  },

  // 🔥 Tambahan penting biar lebih stabil
  secret: process.env.NEXTAUTH_SECRET,
};
