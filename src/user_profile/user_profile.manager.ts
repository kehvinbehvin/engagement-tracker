import { AppDataSource } from "../data-source";
import { Profile } from "../user_profile/entity/User_profile"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError";

const profileRepository = AppDataSource.getRepository(Profile);

export async function getProfileById(id: number): Promise<Profile | null> {
    const profile = await profileRepository.findOne({
        where: {
            id: id,
        },
        // relations: {
        //     expense: true,
        //     payable: true,
        //     receivable: true,
        // }
    })
    if (!profile) {
        throw new HTTPNotFoundError(`Profile id ${id} does not exist`);
    }

    return profile;
}