"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET as string;

export const generateToken = async (userId: string) => {
    return jwt.sign({ userId }, SECRET_KEY);
};

export const setAuthCookie = async (token: string) => {

    const cookie = await cookies();
    cookie.set("auth", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
};

export const verifyAuthToken = async () => {

    const cookie = await cookies();
    const token = cookie.get("auth")?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
        return decoded.userId;
    }
    catch (error) {
        console.error("Error verifying token", error);
    }
};
