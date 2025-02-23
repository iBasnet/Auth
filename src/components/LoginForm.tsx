import { AuthForm } from "./AuthForm";
import { loginUser } from "@/lib/actions";

export function LoginForm() {
    return (
        <AuthForm
            title="Login"
            description="Enter your username below to login to your account"
            submitText="Login"
            action={loginUser}
            redirectUrl="/login"
            extraLink={{ text: "Forgot your password?", href: "#" }}
            footerLink={{ text: "Don't have an account?", action: "Sign Up", href: "/register" }}

        />
    )
}
