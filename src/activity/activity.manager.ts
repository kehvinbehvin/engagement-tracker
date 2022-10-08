import { AppDataSource } from "../data-source"
import { Activity, ActivityType } from "../activity/entity/Activity"
import { Newcomer } from "../newcomer/entity/Newcomer"
import { User } from "../user/entity/User"
import { HTTPInternalSeverError } from "../utils/error_handling/src/HTTPInternalSeverError"
import activityLogger from "./activity.logger"
import { getNewcomerByIdTask } from "../newcomer/newcomer.manager"
import { getMultipleUserByIds } from "../user/user.manager"
import { ActivityRequest } from "./activity.types"

const activityRepository = AppDataSource.getRepository(Activity);
const userRepository = AppDataSource.getRepository(User);

export async function createNewActivityTask(data: ActivityRequest): Promise<Activity> {
    try {
        const activity = new Activity()

        await setActivityData(activity, data);

        await activityRepository.save(activity)

        return activity;

    } catch(error: any) {
        activityLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating activity");
    }
}

async function setActivityData(activity: Activity, data: ActivityRequest) {

    if (data.newcomerId) {
        const newcomerId = data.newcomerId
        const newcomer = getNewcomerByIdTask(newcomerId);
    }

    if (data.adminIds) {
        const adminIds = data.adminIds
        const admins = await getMultipleUserByIds(adminIds);

        for (const admin of admins) {
            try {
                activity.admins.push(admin);
                admin.activity.push(activity);
    
                await userRepository.save(admin);
                await activityRepository.save(activity);

            } catch (error: any) {
                activityLogger.log("error",`${error}`);
                throw new HTTPInternalSeverError("Error when setting activity data");

            }
        }
    }

}