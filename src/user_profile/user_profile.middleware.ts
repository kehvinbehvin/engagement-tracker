import { getUserById } from "../user/user.manager";
import { Request, Response, NextFunction } from "express";
import { getProfileById } from "./user_profile.manager";

async function profile(req: Request, res: Response, next: NextFunction) {
    const userId = Number(res.locals.currentUserId);
    const user = await getUserById(userId);

    if (user === null) {
        res.locals.currentUser = false;
        res.locals.currentProfile = false;
        return next();
    }

    res.locals.currentUser = user;
    const profile = await getProfileById(user.profile.id);

    if (profile === null) {
        res.locals.currentProfile = false;
        return next();
    }

    res.locals.currentProfile = profile;
    return next();

}

export { profile }