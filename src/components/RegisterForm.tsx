import { AuthForm } from "./AuthForm";
import { registerUser } from "@/lib/actions";

export function RegisterForm() {
    return (
        <AuthForm
            title="Register"
            description="Create an account by entering your details below"
            submitText="Sign Up"
            action={registerUser}
            redirectUrl="/register"
            footerLink={{ text: "Already have an account?", action: "Login", href: "/login" }}
        />
    )
}
