import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, CircleCheckBig, Edit } from "lucide-react";
import type { ToDoT } from "@/lib/types";
import { formatDistanceToNow, isPast } from "date-fns";
import DialogSetPush from "./DialogSetPush";

type ToDoCardProps = ToDoT & { fetchToDos: () => void };

export default function ToDoCard({ dueBy, task, isComplete, category, fetchToDos }: ToDoCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    <p>
                        Due {isPast(dueBy) ? `${formatDistanceToNow(dueBy)} ago` : `in ${formatDistanceToNow(dueBy)}`}
                    </p></CardTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex gap-2">
                                {isComplete ? (
                                    <CircleCheckBig className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                ) : (
                                    <Activity className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                )}
                                <DialogSetPush
                                    fetchToDos={fetchToDos}
                                    trigger={
                                        <Edit className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                    }
                                    title={"Edit ToDo"}
                                    description_={"Let's edit the mission and accomplish it."}
                                    task={task}
                                    category={category}
                                    dueBy={dueBy}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isComplete ? "Completed" : "Pending"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{task}</div>
                <Badge variant="outline">{category}</Badge>
            </CardContent>
        </Card >
    )
}