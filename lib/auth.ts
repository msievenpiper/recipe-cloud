import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from 'bcryptjs';

let gprov = null
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  gprov = GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });
}

let fprov = null
if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  fprov = FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  })
}

let tprov = null
if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
  tprov = TwitterProvider({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  })
}

let providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {

      if (!credentials || !credentials.email || !credentials.password) {
        return null;
      }

      const lowercasedEmail = credentials.email.toLowerCase();

      const user = await prisma.user.findUnique({
        where: { email: lowercasedEmail },
      });

      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        return { id: user.id, name: user.name, email: user.email };
      } else {
        return null;
      }
    }
  }),
  gprov,
  fprov,
  tprov
].filter((provider) => provider !== null)


export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Initial sign in
        if ('role' in user) token.role = user.role as string;
        if ('isPremium' in user) token.isPremium = user.isPremium as boolean;
        if ('scanCount' in user) token.scanCount = user.scanCount as number;
      }

      // Impersonation Logic
      if (trigger === "update" && session) {
        // If trying to impersonate
        if (session.impersonateUserId) {
          // Ensure requester is an admin or already impersonating
          if (token.role === 'ADMIN' || token.originalAdmin) {
            const targetUser = await prisma.user.findUnique({
              where: { id: session.impersonateUserId },
              select: { id: true, email: true, role: true, isPremium: true, scanCount: true }
            });

            if (targetUser) {
              // Save original admin if not already saved
              if (!token.originalAdmin) {
                token.originalAdmin = {
                  id: token.id,
                  email: token.email!,
                  role: token.role
                };
              }

              // Overwrite token with target user details
              token.id = targetUser.id;
              token.email = targetUser.email;
              token.role = targetUser.role;
              token.isPremium = targetUser.isPremium;
              token.scanCount = targetUser.scanCount;
            }
          }
        }
        // If stop impersonating
        else if (session.stopImpersonating && token.originalAdmin) {
          token.id = token.originalAdmin.id;
          token.email = token.originalAdmin.email;
          token.role = token.originalAdmin.role;
          // Clear original admin
          delete token.originalAdmin;
          // We will let the DB fetch below refresh the scanCount/isPremium for the admin
        }
        // Normal update
        else {
          return { ...token, ...session.user };
        }
      }

      // Verification: Always fetch latest status from DB to handle external updates (e.g. payment webhook)
      // This ensures we always have the latest isPremium status
      // We skip this if impersonating to avoid overwriting impersonated state with original admin state (though logic above handles swapping token.id)
      // Actually, we SHOULD fetch for the *current* token.id (which might be the impersonated user)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, isPremium: true, scanCount: true }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isPremium = dbUser.isPremium;
          token.scanCount = dbUser.scanCount;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isPremium = token.isPremium;
        session.user.scanCount = token.scanCount;
        if (token.originalAdmin) {
          session.user.isImpersonating = true;
        }
      }
      return session;
    },
    async signIn({ user }) {
      if (user.email) {
        user.email = user.email.toLowerCase();
      }
      return true;
    }
  },
};
