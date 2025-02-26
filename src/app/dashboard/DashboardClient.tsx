"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "./components/user-nav";
import { MainNav } from "./components/main-nav";
import { Search } from "./components/search";
import ToDoCard from "./components/ToDoCard";
import type { ToDoT } from "@/lib/types";
import { toast } from "sonner";
import DialogSetPush from "./components/DialogSetPush";


export default function DashboardClient({ todos }: { todos: ToDoT[] & { error?: string } }) {

    if (todos.error) {
        toast(`An unexpected error occurred!`, {
            description: todos.error,
            action: {
                label: "Roger",
                onClick: () => null,
            },
        })
        return;
    }

    const [searchTerm, setSearchTerm] = useState("");

    const filteredToDos = todos?.filter((todo) =>
        todo.task.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <div className="md:hidden">
                <Image
                    src="/examples/dashboard-light.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/dashboard-dark.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="hidden dark:block"
                />
            </div>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <h1>ToDo App™</h1>
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
                            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <UserNav />
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">

                            <Button variant="ghost"
                                onClick={() => alert("let's get dragging")}>Monk Mode</Button>

                            <DialogSetPush
                                trigger={
                                    <Button>Launch Mission</Button>
                                }
                                title={"Add ToDo"}
                                description_={"Let's launch a new mission and accomplish it."}
                                operationMode={"create"}
                            />

                        </div>
                    </div>

                    <Tabs defaultValue="all" className="space-y-4">

                        <TabsList>
                            <TabsTrigger value="all">All Tasks</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                            <TabsTrigger value="overdue">Overdue</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {
                                    filteredToDos &&
                                    (
                                        filteredToDos.length > 0 ? (
                                            filteredToDos.map((todo, index) => <ToDoCard key={index} {...todo} />)
                                        ) : (
                                            <p className="text-center text-muted-foreground py-2">No tasks found.</p>
                                        )
                                    )
                                }
                            </div>
                        </TabsContent>

                        <TabsContent value="pending">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {
                                    filteredToDos &&
                                    (
                                        filteredToDos.some((todo) => !todo.isComplete) ? (
                                            filteredToDos
                                                .filter((todo) => !todo.isComplete)
                                                .map((todo, index) => <ToDoCard key={index} {...todo} />)
                                        ) : (
                                            <p className="text-center text-muted-foreground py-2">No tasks found.</p>
                                        )
                                    )
                                }
                            </div>
                        </TabsContent>

                        <TabsContent value="completed">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {
                                    filteredToDos &&
                                    (
                                        filteredToDos.some((todo) => todo.isComplete) ? (
                                            filteredToDos
                                                .filter((todo) => todo.isComplete)
                                                .map((todo, index) => <ToDoCard key={index} {...todo} />)
                                        ) : (
                                            <p className="text-center text-muted-foreground py-2">No tasks found.</p>
                                        )
                                    )
                                }
                            </div>
                        </TabsContent>

                        <TabsContent value="overdue">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <p className="text-center text-muted-foreground py-2">No tasks found.</p>
                            </div>
                        </TabsContent>

                    </Tabs>

                </div>
            </div>
        </>
    )
}