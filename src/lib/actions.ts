"use server";

import { User } from "@/lib/models";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { deleteCookies, generateToken, setAuthCookie, setUsernameCookie, verifyAuthToken } from "@/lib/auth";
import { format } from "date-fns";
import { authSchema, type MissionT, type UserT } from "@/lib/zodSchema";
import { ToDoT } from "./types";


export const registerUser = async (prevState: any, formData: FormData) => {
    await connectDB();

    try {
        const result = authSchema.safeParse({
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
        const result = authSchema.safeParse({
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
        }s

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

        if (!user) {
            return { error: "User not found" };
        }

        return JSON.parse(JSON.stringify(user.todos)); // 🔥❤️‍🔥🐦‍🔥

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

export const createToDo = async (payload: MissionT) => {
    connectDB();

    try {
        const userId = await verifyAuthToken();

        await User.updateOne(
            { _id: userId },
            { $push: { todos: { ...payload } } }
        )

        return true;
    }
    catch (err: any) {
        console.log(err.message || "An unexpected error occurred");
        return false;
    }
}