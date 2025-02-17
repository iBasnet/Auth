"use client";

import { useRef, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Trash2, UserRound } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getUser, updateUser } from "@/actions/actions"
import { useRouter } from "next/navigation";

const userSchema = z.object({
    avatar: z.string().url("Invalid avatar URL"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    bio: z.string().max(500, "Bio must not exceed 500 characters"),
})

type UserT = z.infer<typeof userSchema>

export type { UserT };

export default function ProfileSettings() {

    const [user, setUser] = useState<UserT | null>(null)
    const router = useRouter();

    const form = useForm<UserT>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            avatar: "",
            name: "",
            username: "",
            jobTitle: "",
            email: "",
            location: "",
            bio: "",
        },
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            if (typeof reader.result === "string") {
                form.setValue("avatar", reader.result)
            }
        }
    }

    const onSubmit = async (data: UserT) => {
        console.log("Updated user data:", data)

        const success = await updateUser(data);

        if (success) {
            alert("Profile updated successfully!")
        }
        else {
            alert("An error occurred. Please try again.")
        }
    }

    const fetchUser = async () => {
        const user = await getUser() as UserT;
        setUser(user);
        if (user) {
            form.reset(user)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

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
        <div className="container mx-auto py-10">
            <Button
                onClick={() => router.push("/profile")}
                className="absolute top-4 right-4 -space-x-1"
            >
                <span>Profile</span>
                <span><UserRound /></span>
            </Button>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={form.watch("avatar") || ""} alt={form.watch("name") || "User Avatar"} />
                                    <AvatarFallback>{form.watch("name") ? form.watch("name").charAt(0) : "U"}</AvatarFallback>
                                </Avatar>
                                <div className="mt-8 space-x-4 flex">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Upload new avatar
                                    </Button>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:bg-rose-600 opacity-90"
                                                    onClick={() => form.setValue("avatar", "")}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Remove</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500" />
                                        <FormDescription>This is your public display name.</FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="jobTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <FormMessage className="text-rose-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={4} />
                                        </FormControl>
                                        <FormMessage className="text-rose-500" />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
