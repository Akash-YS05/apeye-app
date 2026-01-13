import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/apeye",
  },
  
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  
  plugins: [nextCookies()],
});