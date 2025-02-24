"use client";

import { AuthForm } from "@/components/AuthForm";
import { loginUser } from "@/lib/actions/auth";

export default function LoginPage() {

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <AuthForm
                title="Login"
                description="Enter your username below to login to your account"
                submitText="Login"
                action={loginUser}
                redirectUrl="/login"
                extraLink={{ text: "Forgot your password?", href: "#" }}
                footerLink={{ text: "Don't have an account?", action: "Sign Up", href: "/register" }}
            />
        </main>
    )
}