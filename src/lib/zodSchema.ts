import * as z from "zod"

// auth
export const authSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(16, { message: "Username must be at most 16 characters long" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(32, { message: "Password must be at most 32 characters long" }),
});


// settings
export const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    bio: z.string().max(500, "Bio must not exceed 500 characters"),
})

export type UserTZ = z.infer<typeof userSchema>
export type UserT = UserTZ & { avatar: string }


// mission launch
export const missionSchema = z.object({
    task: z.string().min(3, "Task description is required").max(100, "Task description is too long"),
    category: z.string().nonempty("Category is required"),
})

export type MissionTZ = z.infer<typeof missionSchema>;
export type MissionT = MissionTZ & { dueBy: string };