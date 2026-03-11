"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider
            basePath="/api/auth"
            refetchInterval={0}
            refetchOnWindowFocus={false}
            // Handle null session responses gracefully
            skipCSRFCheck={true}
        >
            {children}
        </SessionProvider>
    );
}
