"use server";

import { verifyAuthToken } from "@/lib/auth"
import { User } from "@/lib/models";

export const getUser = async () => {

    const userId = await verifyAuthToken();

    const user = await User.findOne({ _id: userId });

    const { username } = user;

    const userPublicData = { username };

    return userPublicData;
}