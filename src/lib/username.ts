"use sever";

import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { verifyAuthToken } from "./auth";

export const getUsername = async () => {

    await connectDB();

    try {

        const userId = await verifyAuthToken();

        const user = await User.findOne({ _id: userId });

        if (!user) {
            throw new Error("User not found");
        }

        return user.username as string;
    }
    catch (err: any) {
        // console.error("Error getting username", err);
        return { error: err || "An unexpected error occurred" };
    }
}