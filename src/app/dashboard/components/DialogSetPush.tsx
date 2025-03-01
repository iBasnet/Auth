import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Controller, Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX, useState } from "react";
import { createToDo, updateToDo } from "@/lib/actions/todo";
import { missionSchema, MissionTZ } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useEffect } from "react";

type DialogSetPushProps = {
    trigger: JSX.Element,
    title: string,
    description_: string,
    operationMode: "create" | "update"
    _id?: string,
    dueBy?: Date
    task?: string,
    category?: string,
    isComplete?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

export default function DialogSetPush({
    trigger, title, description_, operationMode, _id, dueBy, task, category, isComplete, createdAt, updatedAt
}: DialogSetPushProps) {

    const [date, setDate] = useState<Date>()
    const [dialogOpen, setDialogOpen] = useState<boolean | undefined>(undefined)

    const { register, control, handleSubmit, reset,
        formState: { errors, isSubmitting } } = useForm({
            resolver: zodResolver(missionSchema),
            // defaultValues: {
            //     task: "Lock in baby lock in",
            //     category: "Discipline"
            // }
        })

    const renderToast = (operationMode: string, success: boolean) => {
        if (success) {
            toast(`Mission ${operationMode === 'create' ? 'added' : 'updated'} successfully!`, {
                description: `It's time to accomplish it.`,
                action: {
                    label: "Roger",
                    onClick: () => null,
                },
            })
            reset();
            setDate(undefined);
            setDialogOpen(false);
        }
        else {
            toast(`Error ${operationMode === 'create' ? 'adding' : 'updating'} mission!`, {
                description: `Try again later.`,
                action: {
                    label: "Roger",
                    onClick: () => null,
                },
            })
        }
    }

    const onSubmit = async (data: MissionTZ) => {
        // await new Promise(resolve => setTimeout(resolve, 3000))
        if (date) {
            if (operationMode === "create") {
                const success = await createToDo({
                    ...data,
                    dueBy: date,
                });
                renderToast(operationMode, success);
            }
            if (operationMode === "update") {
                const success = await updateToDo({
                    ...data,
                    _id: _id,
                    dueBy: date,
                    isComplete: isComplete,
                    // createdAt: createdAt,
                    // updatedAt: updatedAt
                });
                renderToast(operationMode, success);
            }
        }
    }

    useEffect(() => {
        if (task) {
            reset({
                task: task,
                category: category,
            })
            setDate(dueBy);
        }
    }, [task, category, reset]);

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={() => {
                reset();
                if (!task) {
                    setDate(undefined);
                }
                setDialogOpen(undefined); // 🔥❤️‍🔥🐦‍🔥
            }}
        >
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description_}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid gap-4 py-4">
                        <div className="">
                            <Label className="text-right">
                                Mission Description
                            </Label>
                            <Textarea placeholder="Deploy your plans here..."
                                defaultValue={task}
                                {...register("task")}
                            />
                            {errors.task && <span className="text-rose-500 text-sm">{errors.task.message}</span>}
                        </div>

                        <div className="grid grid-cols-4">
                            <Label htmlFor="username" className="grid col-span-1 items-center">
                                Category
                            </Label>

                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={category}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Academics">Academics</SelectItem>
                                                <SelectItem value="Mastery">Mastery</SelectItem>
                                                <SelectItem value="Discipline">Discipline</SelectItem>
                                                <SelectItem value="General">General</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <span className="text-rose-500 text-sm">{errors.category.message}</span>}
                        </div>

                        <div className="grid grid-cols-4">
                            <Label className="grid col-span-1 items-center">
                                Deadline
                            </Label>

                            <Popover>
                                <PopoverTrigger asChild
                                    className="col-span-3">
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date || dueBy}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            className="w-32"
                            type="submit">{isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog >
    )
}
