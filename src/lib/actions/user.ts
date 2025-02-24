"use server";

import { User } from "@/lib/db/models";
import { connectDB } from "@/lib/db/db";
import { verifyAuthToken } from "@/lib/auth";
import { format } from "date-fns";
import { type UserT } from "@/lib/zodSchema";

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
        }

        return userDate;
    }
    catch (err: any) {
        return { error: err.message || "An unexpected error occurred" };
    }
}