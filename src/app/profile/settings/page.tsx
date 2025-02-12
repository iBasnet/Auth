"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyUser } from "./actions";

export default function Settings() {

    const [user, setUser] = useState<any>({});

    async function fetchUser() {

        const data = await verifyUser();

        if (!data) {
            redirect("/login");
        }

        // if (!user) {
        //     redirect("/login");
        // }

        console.log(data);
        setUser(data);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    console.log(user);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <h1><strong>Username:</strong> {user.username}</h1>
            <h1><strong>Password:</strong> {user.password}</h1>
        </main >
    );
}
