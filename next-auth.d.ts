import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isPremium: boolean;
      scanCount: number;
      isImpersonating?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    isPremium: boolean;
    scanCount: number;
    originalAdmin?: {
      id: string;
      email: string;
      role: string;
    };
  }
}
