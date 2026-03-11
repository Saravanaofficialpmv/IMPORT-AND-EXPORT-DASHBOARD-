import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/supabase/queries";

// Ensure NEXTAUTH_URL is set for proper session handling
if (!process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_URL) {
        process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else {
        process.env.NEXTAUTH_URL = "http://localhost:3000";
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please provide email and password");
                }

                const user = await getUserByEmail(credentials.email);

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password_hash);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role: string }).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { role?: string; id?: string }).role = token.role as string;
                (session.user as { role?: string; id?: string }).id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "super-secret-key-change-in-production",
    trustHost: true,
};
