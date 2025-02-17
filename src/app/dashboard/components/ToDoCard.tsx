import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, CircleCheckBig } from "lucide-react";

type ToDoT = {
    time: string;
    task: string;
    category: string;
    isComplete: boolean;
}

export default function ToDoCard({ time, task, category, isComplete }: ToDoT) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{time}</CardTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {isComplete ? (
                                <CircleCheckBig className="h-5 w-5 text-muted-foreground cursor-pointer" />
                            ) : (
                                <Activity className="h-5 w-5 text-muted-foreground cursor-pointer" />
                            )}
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
        </Card>
    )
}