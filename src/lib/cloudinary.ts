"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(base64Image: string) {
    try {
        const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
            upload_preset: "avatar_upload", // Set this in Cloudinary settings
        });

        return { url: uploadedResponse.secure_url };
    } catch (error) {
        return { error: "Upload failed" };
    }
}
