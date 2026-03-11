import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

                // Temporary hardcoded users instead of Supabase
                const demoUsers = [
                    { id: "1", email: "admin@gps.com", name: "Admin User", role: "admin", password: "password123" },
                    { id: "2", email: "manager@gps.com", name: "Manager User", role: "manager", password: "password123" },
                    { id: "3", email: "driver1@gps.com", name: "Driver User", role: "driver", password: "password123" }
                ];

                const user = demoUsers.find(u => u.email === credentials.email);

                if (!user) {
                    // For dev purposes, if not a demo user, just let them in as admin
                    return {
                        id: "999",
                        email: credentials.email,
                        name: "Demo User",
                        role: "admin",
                    };
                }

                if (credentials.password !== user.password) {
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
};
