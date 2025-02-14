import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

    const cookie = await cookies();
    const username = cookie.get("username")?.value;
    const pathname = req.nextUrl.pathname;

    const protectedRoutes = ["/dashboard", "/logout"];
    const authRoutes = ["/login", "/register"];

    if (!username) {
        if (protectedRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    if (username && (authRoutes.includes(pathname))) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (pathname === "/profile" && username) {
        return NextResponse.redirect(new URL(`/profile/${username}`, req.nextUrl));
    }

    return NextResponse.next();
}
