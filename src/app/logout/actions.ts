"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const logout = async () => {

    const cookie = await cookies();
    cookie.delete('auth');
    cookie.delete('username');

}