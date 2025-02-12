// "use client";

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useFormStatus } from "react-dom"
// import { loginUser } from "@/app/actions"
// import { useActionState } from "react"

// export function LoginForm({
//     className,
//     ...props
// }: React.ComponentPropsWithoutRef<"div">) {

//     const [state, formAction] = useActionState(loginUser, undefined);

//     if (state?.redirectUrl) {
//         window.location.href = `http://localhost:3000${state.redirectUrl}`;
//     }

//     return (
//         <div className={cn("flex flex-col gap-6", className)} {...props}>
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="text-2xl">Login</CardTitle>
//                     <CardDescription>
//                         Enter your username below to login to your account
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form action={formAction}>
//                         <div className="flex flex-col gap-6">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="email">Username</Label>
//                                 <Input
//                                     name="username"
//                                     type="text"
//                                     placeholder="username"
//                                     required
//                                 />
//                             </div>
//                             <div className="grid gap-2">
//                                 <div className="flex items-center">
//                                     <Label htmlFor="password">Password</Label>
//                                     <a
//                                         href="#"
//                                         className="ml-auto inline-block text-sm underline-offset-2 hover:underline"
//                                     >
//                                         Forgot your password?
//                                     </a>
//                                 </div>
//                                 <Input name="password" type="password" required />
//                             </div>

//                             <SubmitButton />
//                             {/* {state?.error && <p className="text-rose-500 border-2 border-rose-500 p-2 text-center rounded-lg">{state?.error}</p>} */}

//                             <Button variant="outline" className="w-full">
//                                 Login with GitHub
//                             </Button>
//                         </div>
//                         <div className="mt-4 text-center text-sm">
//                             Don&apos;t have an account?{" "}
//                             <a href="/register" className="underline underline-offset-2">
//                                 Sign up
//                             </a>
//                         </div>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// function SubmitButton() {

//     const { pending } = useFormStatus();

//     return (
//         <Button type="submit"
//             className="w-full"
//             disabled={pending}
//         >
//             {
//                 pending ? (
//                     <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" stroke="currentColor" strokeWidth="4" cx="12" cy="12" r="10"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                 )
//                     : (
//                         <span>Login</span>
//                     )
//             }
//         </Button>
//     )
// }