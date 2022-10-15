import { AppDataSource } from "../data-source"
import { Activity, ActivityType } from "../activity/entity/Activity"
import { Newcomer } from "../newcomer/entity/Newcomer"
import { User } from "../user/entity/User"
import { HTTPInternalSeverError } from "../utils/error_handling/src/HTTPInternalSeverError"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"
import activityLogger from "./activity.logger"
import { getNewcomerByIdTask } from "../newcomer/newcomer.manager"
import { getMultipleUserByIds } from "../user/user.manager"
import { ActivityRequest } from "./activity.types"

const activityRepository = AppDataSource.getRepository(Activity);
const userRepository = AppDataSource.getRepository(User);

export async function createNewActivityTask(data: ActivityRequest): Promise<Activity> {
    try {
        const activity = new Activity()
        
        const updateActivity = await setActivityData(activity, data);

        await activityRepository.save(updateActivity)

        return activity;

    } catch(error: any) {
        activityLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating activity");
    }
}

export async function getActivityByIdTask(activtyId: number): Promise<Activity> {
    try {
        const activity = await activityRepository.findOne({
            where: {
                id: activtyId,
                deleted: false,
            },
            relations: {
                admins: true,
                newcomer: true,
            },
        })

        if (!activity) {
            throw new HTTPBadRequestError("Activity does not exist")
        }

        return activity;
        
    } catch(error: any) {
        activityLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when retrieving activity");
    }
}

async function setActivityData(activity: Activity, data: ActivityRequest) {

    if (data.newcomerId) {
        const newcomerId = data.newcomerId
        const newcomer = await getNewcomerByIdTask(newcomerId);
        activity.newcomer = newcomer
        
    }

    if (data.type) {
        const keys = Object.keys(ActivityType).filter((v) => isNaN(Number(v)));
        
        if (!keys.includes(data.type.toUpperCase())) {
            throw new HTTPBadRequestError("Invalid activity type")
        }
        
        activity.type = data.type
    }

    if (data.activityDate) {
        activity.activityDate = data.activityDate;
        
    }

    await activityRepository.save(activity);
    activityLogger.log("info",`Saved normal columns`);

    // Relationships
    if (data.adminIds) {
        const adminIds = data.adminIds
        const admins = await getMultipleUserByIds(adminIds);

        activity.admins = admins
        
        activityLogger.log("info",`Saving activity admins`);

        await activityRepository.save(activity);

        for (const admin of admins) {
            activityLogger.log("info",`Saving admin side${activity.id}`);
            try {
                admin.activity = [activity];
                
                await userRepository.save(admin);

            } catch (error: any) {
                activityLogger.log("error",`${error}`);
                throw new HTTPInternalSeverError("Error when setting activity data");

            }
        }
    }

    return activity;
}