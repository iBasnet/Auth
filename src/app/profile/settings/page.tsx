import SettingsClient from "./SettingsClient";
import { getUser } from "@/lib/actions/user";
import { type UserT } from "@/lib/zodSchema";

export default async function page() {

    const fetchedUser = await getUser() as UserT;

    return (
        <SettingsClient user={fetchedUser} />
    )
}
