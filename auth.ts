import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "./db/drizzle";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { authenticator } from "otplib";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      authorize: async (credentials) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user) {
          throw new Error("User not found.");
        }

        if (!(await compare(credentials.password as string, user.password!))) {
          throw new Error("Incrorrect credentials");
        }

        if (user.twofactorActivated) {
          const isValidOtp = authenticator.check(
            credentials?.token as string,
            user.twoFactorSecret!
          );

          if (!isValidOtp) {
            throw new Error("Invalid Otp");
          }
        }
        // return user object with their profile data
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
