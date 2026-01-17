import type { User as BetterAuthUser, Session as BetterAuthSession } from "better-auth";

declare module "better-auth" {
  interface User extends BetterAuthUser {
    plan?: string;
  }
  
  interface Session extends BetterAuthSession {
    user: User;
  }
}

declare module "@better-auth/react" {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null;
      createdAt: Date;
      updatedAt: Date;
      plan?: string;
    };
  }
}