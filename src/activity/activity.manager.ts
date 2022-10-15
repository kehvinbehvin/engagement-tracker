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
            select: {
                id: true,
                admins: {
                    id: true,
                    firstName: true,
                    email: true,
                },
                newcomer: {
                    id: true,
                    firstName: true,
                    email: true,
                },
                activityDate: true,
                type: true,
            },
            where: {
                id: activtyId,
                deleted: false,
            },
            relations: {
                admins: true,
                newcomer: true,
            }
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

export async function patchActivityByIdTask(activityId: number, data: ActivityRequest): Promise<Activity> {
    try {
        const activity = await getActivityByIdTask(activityId);

        const updatedActivity = await setActivityData(activity, data);

        return updatedActivity;

    } catch(error: any) {
        activityLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when patching activity");
    }

}

export async function removeActivityTask(activityId: number): Promise<Activity> {
    try {
        const activity = await getActivityByIdTask(activityId);

        activity.deleted = true;
        const deletedActivity = await activityRepository.save(activity);
        return deletedActivity;

    } catch(error: any) {
        activityLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting activity");
    }
}

async function setActivityData(activity: Activity, data: ActivityRequest) {

    if (data.newcomerId) {
        const newcomerId = data.newcomerId
        const newcomer = await getNewcomerByIdTask(newcomerId);
        activity.newcomer = [newcomer]
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

    // Relationships
    if (data.adminIds) {
        const adminIds = data.adminIds
        const admins = await getMultipleUserByIds(adminIds);

        activity.admins = admins
    }

    try {
        const updatedActivity = await activityRepository.save(activity);

        return updatedActivity;

    } catch (error: any) {
        activityLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when setting activity data");
    }
}