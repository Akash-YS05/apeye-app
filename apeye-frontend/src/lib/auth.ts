import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  secret: process.env.BETTER_AUTH_SECRET!,

  // User table customization to add plan field
  user: {
    additionalFields: {
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
        returned: true
      },
    },
  },

  plugins: [nextCookies()],

  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL!,
  ],
});
