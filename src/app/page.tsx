"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function page() {

  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl">
        Authentication
      </h1>
      <Button
        onClick={() => router.push("/dashboard")}
        className="-space-x-1"
      >
        <span>Enter</span>
        <span><LogIn /></span>
      </Button>
    </main>
  )
}