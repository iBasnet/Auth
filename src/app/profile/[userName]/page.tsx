import ProfileClient from "./ProfileClient";
import { getUser, getUserDate } from "@/lib/actions/user";
import { UserDateT } from "@/lib/types";
import { type UserT } from "@/lib/zodSchema";

export default async function page() {

    const fetchedUser = await getUser() as UserT;
    const fetchedUserDate = await getUserDate() as UserDateT;

    return (
        <ProfileClient user={fetchedUser} userDate={fetchedUserDate} />
    )
}
