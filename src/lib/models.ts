"use server";

import mongoose from "mongoose";

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
    },
    { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export { User };