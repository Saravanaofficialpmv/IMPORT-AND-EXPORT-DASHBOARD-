import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // Public routes
        if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
            return NextResponse.next();
        }

        // Protected routes - check authentication
        if (pathname.startsWith("/dashboard")) {
            // Check if user has role
            if (!token?.role) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            // Role-based dashboard routing
            if (pathname === "/dashboard" && token.role === "driver") {
                return NextResponse.redirect(new URL("/dashboard/tracking", req.url));
            }

            if (pathname === "/dashboard" && token.role === "manager") {
                return NextResponse.redirect(new URL("/dashboard/vehicles", req.url));
            }

            // Allow access to the requested page
            return NextResponse.next();
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ token }) {
                // Allow public routes to pass through
                return !!token;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
