"use server";

import mongoose from "mongoose";

const ToDoSchema = new mongoose.Schema(
    {
        dueBy: { type: Date, required: true },
        task: { type: String, required: true },
        isComplete: { type: Boolean, default: false },
        category: { type: String, default: "General" },
    },
    { timestamps: true }
)

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        name: { type: String },
        jobTitle: { type: String },
        email: { type: String, unique: true },
        location: { type: String },
        bio: { type: String },
        todos: [ToDoSchema]
    },
    { timestamps: true }
)

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export { User };