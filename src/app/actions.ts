"use server";

import { User } from "@/lib/models";
import { connectDB } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateToken, setAuthCookie } from "@/lib/auth";

const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(3, "Password must be at least 3 characters long"),
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

        return { redirectUrl: `/profile/${username}` };

    }
    catch (error: any) {
        console.log(error);
        return {
            error: error.message || "An unexpected error occurred"
        }
    }
}
