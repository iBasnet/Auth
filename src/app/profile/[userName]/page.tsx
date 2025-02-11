// "use client";

import { verifyAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "@/lib/models";
import { connectDB } from "@/lib/db";

export default async function ProfilePage() {

    await connectDB();

    const userId = await verifyAuthToken();

    if (!userId) {
        redirect("/login");
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-5xl">Welcome, {user.username}!</h1>
        </div>
    );
}
