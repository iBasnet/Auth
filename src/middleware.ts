import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

    try {
        const cookie = await cookies();
        const username = cookie.get("username")?.value;

        if (!username) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }

        if (req.nextUrl.pathname === "/profile") {
            return NextResponse.redirect(new URL(`/profile/${username}`, req.nextUrl));
        }

        return NextResponse.next();

    }
    catch (error: any) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
}

export const config = {
    matcher: "/profile",
}