import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const cookie = await cookies();
    const username = cookie.get("username")?.value;
    const pathname = req.nextUrl.pathname;

    if (!username) {
        if (pathname === "/dashboard" || pathname === "/profile/settings") {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    if (username && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (pathname === "/profile" && username) {
        return NextResponse.redirect(new URL(`/profile/${username}`, req.nextUrl));
    }

    return NextResponse.next();
}
