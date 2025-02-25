"use server";

import { User } from "@/lib/db/models";
import { connectDB } from "@/lib/db/db";
import { verifyAuthToken } from "@/lib/auth";
import { type MissionT } from "@/lib/zodSchema";
import { ToDoT } from "../types";
import { revalidatePath } from "next/cache";

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

export const createToDo = async (payload: MissionT) => {
    connectDB();

    try {
        const userId = await verifyAuthToken();

        const result = await User.updateOne(
            { _id: userId },
            {
                $push: { todos: { ...payload } }
            }
        )

        if (result.modifiedCount > 0) {
            revalidatePath("/dashboard");
        }

        return result.modifiedCount > 0;
    }
    catch (err: any) {
        console.log(err.message || "An unexpected error occurred");
        return false;
    }
}

export const updateToDo = async (payload: ToDoT) => {
    await connectDB();

    try {
        const userId = await verifyAuthToken();

        const result = await User.updateOne(
            { _id: userId, "todos._id": payload._id },
            {
                $set: {
                    "todos.$.task": payload.task,
                    "todos.$.category": payload.category,
                    "todos.$.dueBy": payload.dueBy,
                    "todos.$.isComplete": payload.isComplete,
                }
                // $(Position Operator): The "$" is used to refer to the "first matching element" in the todos array "that satisfies the condition you specify in the query".
            }
        )

        if (result.modifiedCount > 0) {
            revalidatePath("/dashboard");
        }

        return result.modifiedCount > 0;
    }
    catch (err: any) {
        console.log(err.message || "An unexpected error occurred");
        return false;
    }
}

export const toggleComplete = async (payload: { _id?: string, isComplete?: boolean }) => {
    await connectDB();

    try {
        const userId = await verifyAuthToken();

        const result = await User.updateOne(
            { _id: userId, "todos._id": payload._id },
            {
                $set: {
                    "todos.$.isComplete": !payload.isComplete
                }
            }
        )

        if (result.modifiedCount > 0) {
            revalidatePath("/dashboard");
        }

        return result.modifiedCount > 0;
    }
    catch (err: any) {
        console.log(err.message || "An unexpected error occurred");
        return false;
    }
}