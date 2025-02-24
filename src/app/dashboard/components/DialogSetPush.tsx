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
import { useState } from "react";
import { createToDo } from "@/lib/actions";
import { missionSchema, MissionTZ } from "@/lib/zodSchema";


export default function DialogSetPush() {

    const [date, setDate] = useState<Date>()

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(missionSchema),
        defaultValues: {
            task: "Lock in baby lock in",
            category: "Discipline"
        }
    })

    const onSubmit = async (data: MissionTZ) => {
        // await new Promise(resolve => setTimeout(resolve, 3000))
        if (date) {
            const result = await createToDo({ ...data, dueBy: date.toString() });
            if (result) alert("Mission added successfully!")
            else alert("Failed to add mission!")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Launch Mission</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add ToDo</DialogTitle>
                    <DialogDescription>
                        Let's launch a new mission and accomplish it.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid gap-4 py-4">
                        <div className="">
                            <Label htmlFor="name" className="text-right">
                                Mission Description
                            </Label>
                            <Textarea placeholder="Deploy your plans here..."
                                {...register("task")}
                            />
                            {errors.task && <span className="text-red-500">{errors.task.message}</span>}
                        </div>

                        <div className="grid grid-cols-4">
                            <Label htmlFor="username" className="grid col-span-1 items-center">
                                Category
                            </Label>

                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Academics">Academics</SelectItem>
                                                <SelectItem value="Mastery">Mastery</SelectItem>
                                                <SelectItem value="Discipline">Discipline</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <span className="text-red-500">{errors.category.message}</span>}
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
                                        selected={date}
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
        </Dialog>
    )
}
