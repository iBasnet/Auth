import { UserProfileCard } from "@/components/user-profile-card"
import { Josefin_Slab } from "next/font/google"

export default function ProfilePage() {

    const user = {
        name: "Patrick Bateman",
        username: "bateman",
        avatar: "https://d2ycltig8jwwee.cloudfront.net/features/515/fullwidth.8b8fe027.jpg",
        jobTitle: "Vice President",
        email: "bateman@nyc.vip",
        location: "New York, NY",
        bio: "I have all the characteristics of a human being: blood, flesh, skin, hair; but not a single, clear, identifiable emotion, except for greed and disgust.",
        joined: "Apr 14, 2000",
        logged: "Jan 20, 2025"
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <UserProfileCard user={user} />
        </div>
    )
}

