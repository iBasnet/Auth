"use server";

import { User } from "@/lib/models";
import { connectDB } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { deleteCookies, generateToken, setAuthCookie, setUsernameCookie, verifyAuthToken } from "@/lib/auth";
import { format } from "date-fns";
import type { UserT } from "@/app/profile/settings/page";
import { ToDoT } from "./types";

const loginSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(16, { message: "Username must be at most 16 characters long" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(32, { message: "Password must be at most 32 characters long" }),
});

export const registerUser = async (prevState: any, formData: FormData) => {

    await connectDB();

    try {
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
    catch (err: any) {
        return {
            error: err.message || "An unexpected error occurred"
        }
    }
}

export const loginUser = async (prevState: any, formData: FormData) => {

    await connectDB();

    try {
        const result = loginSchema.safeParse({
            username: formData.get("username") as string,
            password: formData.get("password") as string,
        })

        if (!result.success) {
            return {
                error: result.error.issues[0].message,
                values: { username: formData.get("username") as string }
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
    catch (err: any) {
        return {
            error: err.message || "An unexpected error occurred"
        }
    }
}

export const logoutUser = async () => {

    await connectDB();

    try {
        await deleteCookies();
        return true;

    }
    catch (err: any) {
        console.error(err.message || "An unexpected error occurred");
        return false;
    }
}

export const getUser = async () => {

    await connectDB();

    try {

        const userId = await verifyAuthToken();

        const user = await User.findOne({ _id: userId });

        const { avatar, name, username, jobTitle, email, location, bio } = user;

        const userPublicData = { avatar, name, username, jobTitle, email, location, bio };

        return userPublicData;
    }
    catch (err: any) {
        return { error: err.message || "An unexpected error occurred" };
    }
}

export const updateUser = async (payload: UserT) => {

    await connectDB();

    try {
        const userId = await verifyAuthToken();

        await User.updateOne(
            { _id: userId },
            { $set: { ...payload } }
        )

        return true;
    }
    catch (err: any) {
        console.log(err.message || "An unexpected error occurred");
        return false
    }
}

export const getUserDate = async () => {
    await connectDB();

    try {

        const userId = await verifyAuthToken();

        const user = await User.findOne({ _id: userId });

        const { createdAt, updatedAt } = user;

        const userDate = {
            joined: format(new Date(createdAt), "MMM d, yyyy"),
            logged: format(new Date(updatedAt), "MMM d, yyyy")
        };

        return userDate;
    }
    catch (err: any) {
        return { error: err.message || "An unexpected error occurred" };
    }
}

export const getUserToDos = async () => {
    await connectDB();

    try {
        const userId = await verifyAuthToken();
        const user = await User.findOne({ _id: userId });
        const { todos } = user;

        return todos;
    }
    catch (err: any) {
        return { error: err.message || "An unexpected error occurred" };
    }
}

export const updateUserToDo = async (payload: ToDoT) => {
    await connectDB();

    try {
        const userId = await verifyAuthToken();

        await User.updateOne(
            { _id: userId },
            { $set: { todos: payload } }
        )

        return true;
    }
    catch (err: any) {
        console.log(err.message || "An unexpected error occurred");
        return false
    }
}