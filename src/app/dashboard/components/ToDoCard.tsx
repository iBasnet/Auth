"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, CircleCheckBig, Edit } from "lucide-react";
import type { ToDoT } from "@/lib/types";
import { formatDistanceToNow, isPast } from "date-fns";
import DialogSetPush from "./DialogSetPush";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleComplete } from "@/lib/actions/todo";
import { useOptimistic, useTransition } from "react";

type ToDoCardProps = ToDoT;

export default function ToDoCard({ dueBy, task, isComplete, category, _id, createdAt, updatedAt }: ToDoCardProps) {
    // Add useTransition hook
    const [isPending, startTransition] = useTransition();

    // Set up optimistic UI state
    const [optimisticToDo, setOptimisticToDo] = useOptimistic(
        { isComplete },
        (state, newIsComplete?: boolean) => ({ ...state, isComplete: newIsComplete })
    )

    const handleStatus = async () => {
        // Use startTransition to wrap the optimistic update
        startTransition(async () => {
            // Update optimistically
            setOptimisticToDo(!optimisticToDo.isComplete);

            // Perform the server request
            const success = await toggleComplete({ _id, isComplete: optimisticToDo.isComplete });

            if (!success) {
                // If the server update fails, revert the optimistic update
                setOptimisticToDo(isComplete);
                alert("Failed to update todo status");
            }
        })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    <p>
                        Due {isPast(dueBy) ? `${formatDistanceToNow(dueBy)} ago` : `in ${formatDistanceToNow(dueBy)}`}
                    </p>
                </CardTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex gap-2">
                                {optimisticToDo.isComplete ? (
                                    <CircleCheckBig className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                ) : (
                                    <Activity className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                )}
                                <DialogSetPush
                                    trigger={
                                        <Edit className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                    }
                                    title={"Edit ToDo"}
                                    description_={"Let's edit the mission and accomplish it."}
                                    operationMode={"update"}
                                    ///
                                    _id={_id}
                                    dueBy={dueBy}
                                    task={task}
                                    category={category}
                                    isComplete={optimisticToDo.isComplete}
                                    createdAt={createdAt}
                                    updatedAt={updatedAt}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{optimisticToDo.isComplete ? "Completed" : "Pending"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold mb-4">
                    <span className={optimisticToDo.isComplete ? "line-through text-muted-foreground" : ""}>{task}</span>
                </div>
                <div className="flex border border-1 border-slate-100/0 items-center space-x-2">
                    <Badge variant="outline">{category}</Badge>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Checkbox
                                    checked={optimisticToDo.isComplete}
                                    onClick={handleStatus}
                                // disabled={isPending}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mark as {optimisticToDo.isComplete ? "Incomplete" : "Complete"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}