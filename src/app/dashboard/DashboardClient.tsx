"use client";

import { useState, useRef, useEffect } from "react";
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
import { Toggle } from "@/components/ui/toggle";
import { SquareDashedMousePointer } from "lucide-react";
import { createSwapy } from 'swapy';
import { type Swapy } from "swapy";
import "./swapy.css";
import Loading from "../loading";
import ToDoSkeleton from "./components/ToDoSkeleton";

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

    const containerRef = useRef<HTMLDivElement>(null);
    const swapyRef = useRef<Swapy>(null);

    useEffect(() => {
        if (containerRef.current) {
            swapyRef.current = createSwapy(containerRef.current, {
                animation: 'dynamic' // or spring or none
            })
            swapyRef.current?.enable(false);
        }

        return () => {
            swapyRef.current?.destroy(); // Proper cleanup to avoid memory leaks
        }
    }, []);

    const [monkMode, setMonkMode] = useState(false);

    const handleMonkMode = () => {
        setMonkMode(!monkMode);
        monkMode ? swapyRef.current?.enable(false) : swapyRef.current?.enable(true);
    }

    const [isDragging, setIsDragging] = useState(false);
    const [draggedItemHeight, setDraggedItemHeight] = useState<number | undefined>(undefined);

    swapyRef.current?.onSwap((event) => {
        // console.log(event.newSlotItemMap.asArray);

        const newOrder: string[] = event.newSlotItemMap.asArray.map((object) => object.item);
        console.log(newOrder);
        localStorage.setItem("todoOrder", JSON.stringify(newOrder));
        // setSwapOrder(newOrder);
        const draggedElement = document.querySelector("[data-swapy-dragging]");
        if (draggedElement) {
            setDraggedItemHeight(draggedElement.clientHeight / 16);
        }
    });

    swapyRef.current?.onSwapStart(() => {
        setIsDragging(true);
    });

    swapyRef.current?.onSwapEnd(() => {
        setIsDragging(false);
    });


    const [sortedToDos, setSortedToDos] = useState([...todos]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get the saved order from localStorage
        const savedOrder = localStorage.getItem("todoOrder")
            ? JSON.parse(localStorage.getItem("todoOrder")!)
            : null;

        if (savedOrder && savedOrder.length > 0) {
            // Create a copy of todos to avoid mutation
            const todosToSort = [...todos];

            // Sort todos based on the order in savedOrder
            todosToSort.sort((a, b) => {
                // Find position of each todo's ID in the saved order
                const indexA = savedOrder.indexOf(a._id);
                const indexB = savedOrder.indexOf(b._id);

                // Handle cases where IDs are not in saved order
                if (indexA === -1 && indexB === -1) return 0; // Keep original order
                if (indexA === -1) return 1; // Put items not in saved order at the end
                if (indexB === -1) return -1;

                // Sort by the position in the saved order
                return indexA - indexB;
            });

            setSortedToDos(todosToSort);
        } else {
            // If no saved order, use original todos
            setSortedToDos([...todos]);

        }
        setIsLoading(false);
    }, [todos]); // Re-sort when todos change

    if (isLoading && sortedToDos?.length === 0) {
        return <Loading />;
    }

    const [searchTerm, setSearchTerm] = useState("");

    // const filteredToDos = reorderedToDos?.filter((todo) =>
    //     todo.task.toLowerCase().includes(searchTerm.toLowerCase())
    // )

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

                            <Toggle onClick={handleMonkMode}>
                                <SquareDashedMousePointer />
                                <p>Monk Mode</p>
                            </Toggle>

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
                            <div ref={containerRef} className="swapy-container grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {
                                    isLoading ? (
                                        Array(todos.length).fill(0).map((_, index) => (
                                            <div className="slot" data-swapy-slot={index}>
                                                <div
                                                    className="item" data-swapy-item={index}>
                                                    <ToDoSkeleton />
                                                </div>
                                            </div>
                                        ))
                                    ) :
                                        (
                                            (
                                                sortedToDos && sortedToDos.length > 0 ? (

                                                    sortedToDos.map((todo, index) => (
                                                        <div className="slot" data-swapy-slot={`${index}`}
                                                            style={{ height: `${draggedItemHeight}rem` }}
                                                        >
                                                            <div
                                                                className="item" data-swapy-item={`${todo._id}`}
                                                                style={monkMode ? isDragging ? { cursor: "grabbing" } : { cursor: "grab" } : {}}
                                                            >
                                                                <ToDoCard key={index} {...todo} />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-muted-foreground py-2">No tasks found.</p>
                                                )
                                            )
                                        )
                                }
                            </div>
                        </TabsContent>

                        {/* <TabsContent value="pending">
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
                        </TabsContent> */}

                        {/* <TabsContent value="completed">
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
                        </TabsContent> */}

                        <TabsContent value="overdue">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <p className="text-center text-muted-foreground py-2">No tasks found.</p>
                            </div>
                        </TabsContent>

                    </Tabs>

                </div>
            </div >
        </>
    )
}