"use server";

import { verifyAuthToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";


export const verifyUser = async () => {

    await connectDB();

    try {
        const userId = await verifyAuthToken();

        if (!userId) {
            return { error: "User not found" };
        }

        const user = await User.findOne({ _id: userId });

        if (!user) {
            throw new Error("User not found");
        }

        // const userData = {
        //     _id: user._id.toString(),
        //     username: user.username,
        //     password: user.password,
        //     createdAt: user.createdAt.toISOString(),
        //     updatedAt: user.updatedAt.toISOString(),
        //     __v: user.__v
        // };

        return user;
    }
    catch (err: any) {
        // console.error("Error verifying user", err);
        return { error: err.message || "An unexpected error occurred" };
    }

}