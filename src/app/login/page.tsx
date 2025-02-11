"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginUser } from "@/app/actions";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {


    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <LoginForm />
        </div>
    );
}