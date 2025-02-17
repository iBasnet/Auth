"use client";

import { Button } from "@/components/ui/button"
import { UserProfileCard } from "@/components/user-profile-card"
import { Box } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserT } from "../settings/page";
import { useEffect, useState } from "react";
import { getUser } from "@/actions/actions";
import { getUserDate } from "@/actions/actions";

type UserDateT = {
    joined: string;
    logged: string;
}

export type { UserDateT };

export default function ProfilePage() {

    const router = useRouter();
    const [user, setUser] = useState<UserT>();
    const [userDate, setUserDate] = useState<UserDateT>();

    const fetchUser = async () => {
        const fetchedUser = await getUser() as UserT;
        setUser(fetchedUser);
        const fetchedUserDate = await getUserDate() as UserDateT;
        setUserDate(fetchedUserDate);
    }

    useEffect(() => {
        fetchUser();
    }, []);


    if (!user && !userDate) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
            </main>
        )
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Button
                onClick={() => router.push("/dashboard")}
                className="absolute top-4 right-4 -space-x-1"
            >
                <span>Dashboard</span>
                <span><Box /></span>
            </Button>
            {user && userDate && <UserProfileCard user={user} userDate={userDate} />}
        </div>
    )
}

