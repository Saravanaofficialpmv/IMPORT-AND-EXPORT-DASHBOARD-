import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// Dynamically set NEXTAUTH_URL from the actual request host on every call
// This fixes CLIENT_FETCH_ERROR in preview/dynamic environments
function getHandler(req: NextRequest) {
    const host = req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    if (host) {
        process.env.NEXTAUTH_URL = `${proto}://${host}`;
    }
    return NextAuth(authOptions);
}

export async function GET(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
    return getHandler(req)(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
    return getHandler(req)(req, ctx);
}
