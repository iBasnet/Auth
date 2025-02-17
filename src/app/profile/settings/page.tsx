"use client";

import { useEffect, useState } from "react"
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getUser, updateUser } from "@/actions/actions"
import { useRouter } from "next/navigation";

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    bio: z.string().max(500, "Bio must not exceed 500 characters"),
})

type UserTZ = z.infer<typeof userSchema>
type UserT = UserTZ & { avatar: string }

export type { UserT };

export default function ProfileSettings() {

    const [user, setUser] = useState<UserT | null>(null)
    const router = useRouter();
    const [image, setImage] = useState<string>(""); // Image preview
    const [avatar, setAvatar] = useState<string>(""); // Avatar image

    const form = useForm<UserTZ>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            username: "",
            jobTitle: "",
            email: "",
            location: "",
            bio: "",
        },
    })

    const onSubmit = async (data: UserTZ) => {

        const payload = {
            ...data,
            avatar: avatar,
        }

        // console.log("Updated user data:", data);

        const success = await updateUser(payload);

        if (success) {
            alert("Profile updated successfully!");
        }
        else {
            alert("An error occurred. Please try again.");
        }
    }

    const fetchUser = async () => {
        const user = await getUser() as UserT;
        setUser(user);
        if (user) {
            form.reset(user);
            setAvatar(user.avatar || "");
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    // leave confirmation for browser navigation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (form.formState.isDirty) {
                e.preventDefault();
                e.returnValue = "Are you sure you want to leave? Your changes may not be saved.";
                return "Are you sure you want to leave? Your changes may not be saved.";
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
    }, [form.formState.isDirty]);

    // leave confirmation for react router navigation
    const handleNavigate = async (url: string) => {
        if (form.formState.isDirty) {
            const confirmNavigation = window.confirm("You have unsaved changes. Are you sure you want to leave?");
            if (!confirmNavigation) {
                return;
            }
        }
        router.push(url);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleAvatarUpload = () => {
        if (image) {
            setAvatar(image);
            setImage("");
        }
    }

    const handleAvatarDelete = () => {
        setAvatar("");
    }

    return (
        <div className="container mx-auto py-10">

            <Button
                onClick={() => handleNavigate("/profile")}
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

                    <div className="flex items-center space-x-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={avatar || ""} alt={form.watch("name") || "User Avatar"}
                                className="object-cover object-center"
                            />
                            <AvatarFallback>{form.watch("name") ? form.watch("name").charAt(0) : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="mt-8 space-x-4 flex">
                            <Dialog onOpenChange={(open) => !open && setImage("")}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        type="button"
                                    >
                                        Upload new avatar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Upload avatar</DialogTitle>
                                        <DialogDescription>
                                            Please choose a 2x2 image to use as your avatar.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        {image && <img src={image} alt="Preview" className="w-44 h-44 object-cover rounded-md mx-auto" />}
                                        <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="ghost"
                                                onClick={() => setImage("")}
                                            >
                                                Close
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button type="submit"
                                                onClick={handleAvatarUpload}
                                            >Confirm</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="hover:bg-rose-600 opacity-90"
                                            onClick={handleAvatarDelete}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Remove</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
        </div >
    )
}
