"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/actions/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function page() {

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const success = await logoutUser()

        if (success) {
            router.push("/login");
        }
        setIsLoggingOut(false);
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will end your current session, and you will need to log in again to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                        >
                            {isLoggingOut ? "Pending..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    )
}