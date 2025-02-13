"use server";

import { User } from "@/lib/models";
import { connectDB } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie, setUsernameCookie } from "@/lib/auth";

const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginUser = async (prevState: any, formData: FormData) => {

    try {
        await connectDB();

        const result = loginSchema.safeParse({
            username: formData.get("username") as string,
            password: formData.get("password") as string,
        })

        if (!result.success) {
            console.log(result)
            return {
                error: result.error.issues[0].message
            }
        }

        const { username, password } = result.data;

        const user = await User.findOne({ username });

        if (!user) {
            return {
                error: "Invalid username or password"
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                error: "Invalid username or password"
            }
        }

        const token = await generateToken(user._id.toString());
        await setAuthCookie(token);
        await setUsernameCookie(user.username);

        return {
            redirectUrl: `/dashboard`
        }

    }
    catch (error: any) {
        console.log(error);
        return {
            error: error.message || "An unexpected error occurred"
        }
    }
}

export const registerUser = async (prevState: any, formData: FormData) => {


    try {
        await connectDB();

        const result = loginSchema.safeParse({
            username: formData.get("username") as string,
            password: formData.get("password") as string,
        })

        if (!result.success) {
            console.log(result)
            return {
                error: result.error.issues[0].message
            }
        }

        const { username, password } = result.data;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return {
                error: "User already exists. Try a different username."
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, password: hashedPassword });

        if (user) {
            return {
                redirectUrl: `/login`
            }
        }
    }
    catch (error: any) {
        return {
            error: error.message || "An unexpected error occurred"
        }
    }
}