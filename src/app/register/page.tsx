"use client";

import { AuthForm } from "@/components/AuthForm";
import { registerUser } from "@/lib/actions/auth";

export default function LoginPage() {

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <AuthForm
                title="Register"
                description="Create an account by entering your details below"
                submitText="Sign Up"
                action={registerUser}
                redirectUrl="/register"
                footerLink={{ text: "Already have an account?", action: "Login", href: "/login" }}
            />
        </main>
    )
}