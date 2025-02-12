"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import { toast } from "sonner"

type AuthFormProps = {
    title: string;
    description: string;
    submitText: string;
    action: (prevState: any, formData: FormData) => Promise<any>;
    redirectUrl?: string;
    extraLink?: { text: string; href: string };
    footerLink?: { text: string; action: string, href: string };
}

export function AuthForm({
    title,
    description,
    submitText,
    action,
    redirectUrl,
    extraLink,
    footerLink,
}: AuthFormProps) {

    const [state, formAction] = useActionState(action, undefined);

    if (state?.redirectUrl) {
        window.location.href = `http://localhost:3000${state.redirectUrl}`;
    }

    useEffect(() => {
        if (state?.error) {
            toast("Failed To Register User", {
                description: `${state.error}`,
                action: {
                    label: "Roger",
                    onClick: () => null,
                },
            });
        }
    }, [state]);

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    name="username"
                                    type="text"
                                    placeholder="username"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {extraLink && (
                                        <a
                                            href={extraLink.href}
                                            className="ml-auto inline-block text-sm underline-offset-2 hover:underline"
                                        >
                                            {extraLink.text}
                                        </a>
                                    )}
                                </div>
                                <Input name="password" type="password" required />
                            </div>

                            {
                                state?.error && (
                                    <div className="text-rose-500 text-sm text-center">
                                        {state?.error}
                                    </div>
                                )
                            }

                            <SubmitButton text={submitText} />

                            <Button variant="outline" className="w-full">
                                Login with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            {redirectUrl && (
                                <>
                                    {footerLink?.text}{" "}
                                    <a href={footerLink?.href} className="underline underline-offset-2">
                                        {footerLink?.action}
                                    </a>
                                </>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full"
            disabled={pending}
        // onClick={() => validateUser()}
        >
            {pending ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" stroke="currentColor" strokeWidth="4" cx="12" cy="12" r="10"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <span>{text}</span>
            )}
        </ Button>
    );
}
