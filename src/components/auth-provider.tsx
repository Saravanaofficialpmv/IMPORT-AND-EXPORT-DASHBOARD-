"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider
            // Use relative basePath so it always matches the current host
            basePath="/api/auth"
            refetchInterval={0}
            refetchOnWindowFocus={false}
        >
            {children}
        </SessionProvider>
    );
}
