import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN || "joinditto.in";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name: string;
      image?: string;
      isAdmin: boolean;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { hd: ALLOWED_DOMAIN },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn({ profile }) {
      const email = profile?.email || "";
      const domain = email.split("@")[1] || "";
      return domain === ALLOWED_DOMAIN;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.isAdmin = ADMIN_EMAILS.includes(profile.email || "");
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = (token.isAdmin as boolean) || false;
      }
      return session;
    },
  },
});
