"use client";

import { Button } from "@/components/ui/button"
import { UserProfileCard } from "@/components/user-profile-card"
import { Box } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserT } from "@/lib/zodSchema";
import type { UserDateT } from "@/lib/types";

export default function ProfileClient({ user, userDate }: { user: UserT, userDate: UserDateT }) {

    const router = useRouter();

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Button
                onClick={() => router.push("/dashboard")}
                className="absolute top-4 right-4 -space-x-1"
            >
                <span>Dashboard</span>
                <span><Box /></span>
            </Button>
            <UserProfileCard user={user} userDate={userDate} />
        </div>
    )
}

