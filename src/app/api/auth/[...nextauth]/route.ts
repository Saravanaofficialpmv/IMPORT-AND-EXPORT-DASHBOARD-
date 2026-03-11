import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// Dynamically set NEXTAUTH_URL from the request host
export async function GET(req: NextRequest, ctx: any) {
    // Set NEXTAUTH_URL from the actual request host
    const host = req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host && !process.env.NEXTAUTH_URL?.includes(host)) {
        process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
    
    const handler = NextAuth(authOptions);
    return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
    // Set NEXTAUTH_URL from the actual request host
    const host = req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "https";
    if (host && !process.env.NEXTAUTH_URL?.includes(host)) {
        process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
    
    const handler = NextAuth(authOptions);
    return handler(req, ctx);
}
