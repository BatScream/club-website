// lib/auth.ts
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";

/**
 * Replace these emails with your coaches' emails.
 * Later you can move this to a DB and check dynamically.
 */
const COACH_EMAILS = ["clement.lloyd@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Restrict sign-in if you want only specific emails to be able to sign in
  callbacks: {
    async signIn({ user, account, profile }) {
      // `user.email` or `profile.email` contains the Google email
      const email = (user?.email ?? profile?.email) as string | undefined;
      if (!email) return false;
      // Allow only known coach emails — change logic as needed
      return COACH_EMAILS.includes(email);
    },

    // Persist role into the token and session
    async jwt({ token, user }) {
      // `user` exists on first sign-in
      if (user?.email) {
        token.role = COACH_EMAILS.includes(user.email) ? "coach" : "user";
      }
      return token;
    },

    async session({ session, token }) {
      // Attach role to session for easy checks on client/server
      (session.user as any).role = (token as any).role ?? "user";
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
 
// Helper for server components / server routes
export const getServerAuthSession = () => getServerSession(authOptions);
