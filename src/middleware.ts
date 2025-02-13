import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware() {

    const cookie = await cookies();
    const username = cookie.get("username")?.value;

    if (username === "pratik") {
        return NextResponse.redirect("https://linktr.ee/basnet");
    }

    return NextResponse.next();
}