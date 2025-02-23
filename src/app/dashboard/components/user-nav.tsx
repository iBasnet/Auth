"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { getUser, logoutUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { GetInitials, TitleCase } from "@/lib/utils";

type UserNavT = {
    name: string,
    username: string,
    email: string
    avatar: string
}

export function UserNav() {

    const router = useRouter();
    const { setTheme } = useTheme();
    const [user, setUser] = useState<UserNavT>();

    const fetchUser = async () => {

        const fetchedUser = await getUser() as UserNavT;

        if (!fetchedUser.name || !fetchedUser.email) {
            router.push("/profile/settings");
        } else {
            const { name, username, email, avatar } = fetchedUser;
            setUser({ name, username, email, avatar });
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const success = await logoutUser();
        if (success) {
            router.push("/login");
        }
    }

    if (!user) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
            </main>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={`@${TitleCase(user.name)}`}
                            className="object-cover object-center"
                        />
                        <AvatarFallback>{GetInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{TitleCase(user.name)}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push(`/profile/${user.username}`)}>
                        Profile
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/profile/settings`)}>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <span>Theme</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}>
                    Log out
                    <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}