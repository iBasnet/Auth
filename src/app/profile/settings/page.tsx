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
import { getUser, updateUser } from "@/lib/actions"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GetInitials } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { userSchema } from "@/lib/zodSchema";
import type { UserT, UserTZ } from "@/lib/zodSchema";


export default function ProfileSettings() {

    const [user, setUser] = useState<UserT | null>(null)
    const router = useRouter();
    const [preview, setPreview] = useState<string>(""); // Image preview
    const [avatar, setAvatar] = useState<string>(""); // Avatar image
    const [isCloudinaryProcessing, setIsCloudinaryProcessing] = useState<boolean>(false);

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

        // test logs
        // console.log("Updated user data:", data);

        const success = await updateUser(payload);

        if (success) {
            toast(`Profile updated successfully!`, {
                description: `Changes have been saved.`,
                action: {
                    label: "Roger",
                    onClick: () => null,
                },
            })
        }
        else {
            toast(`Error updating profile`, {
                description: `Try again later.`,
                action: {
                    label: "Roger",
                    onClick: () => null,
                },
            })
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
                // e.returnValue = "Are you sure you want to leave? Your changes may not be saved.";
                // return "Are you sure you want to leave? Your changes may not be saved.";
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

    const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAvatarUpload = async () => {
        if (preview) {
            setIsCloudinaryProcessing(true)

            try {
                const response = await uploadToCloudinary(preview)

                if (response.url) {
                    setAvatar(response.url)
                    setPreview("")
                }
                else {
                    toast("Upload failed. Please try again.")
                }
            }
            catch (error) {
                toast("Upload failed. Please try again.")
            }
            finally {
                setIsCloudinaryProcessing(false)
            }
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
                        <Avatar className="w-24 h-24 flex items-center justify-center">
                            {
                                isCloudinaryProcessing
                                    ? (
                                        <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white" role="status" aria-label="loading">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <AvatarImage src={avatar || ""} alt={form.watch("name") || "User Avatar"}
                                                className="object-cover object-center" />
                                            <AvatarFallback><h1 className="text-lg">{form.watch("name") ? GetInitials(form.watch("name")) : "U"}</h1></AvatarFallback>
                                        </>
                                    )
                            }
                        </Avatar>
                        <div className="mt-8 space-x-4 flex">
                            <Dialog onOpenChange={(open) => !open && setPreview("")}>
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
                                        {preview && <img src={preview} alt="Preview" className="w-44 h-44 object-cover rounded-md mx-auto" />}
                                        <Input id="picture" type="file" accept="image/*" onChange={handlePreviewChange} className="cursor-pointer" />
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="ghost"
                                                onClick={() => setPreview("")}
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
