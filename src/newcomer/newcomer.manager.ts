import { AppDataSource } from "../data-source"
import { Newcomer } from "../newcomer/entity/Newcomer"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError"
import { HTTPInternalSeverError } from "../utils/error_handling/src/HTTPInternalSeverError"
import newcomerLogger from "./newcomer.logger"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"

const newcomerRepository = AppDataSource.getRepository(Newcomer);

export async function getNewcomerByIdTask(id: number): Promise<Newcomer> {
    try {
        const newcomer = await newcomerRepository.findOne({
            where: {
                id: id,
                deleted: false,
            }
        })
    
        if (!newcomer) {
            throw new HTTPNotFoundError(`Newcomer id ${id} does not exist`);
        }
    
        return newcomer
    } catch(error: any) {
        newcomerLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when finding newcomer by id");
    }
}

export async function getNewcomerByEmailTask(email: string): Promise<Newcomer | null> {
    try {
        const newcomer = await newcomerRepository.findOneBy({
            email: email,
            deleted: false,
        });
       
        return newcomer
    } catch (error: any) {
        newcomerLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error while getting newcomer by email");
    }
}

export async function createNewcomerTask(data: Newcomer): Promise<Newcomer>  {
    try {
        const newcomer = new Newcomer()

        await setNewcomerData(newcomer, data);

        await newcomerRepository.save(newcomer)

        return newcomer;

    } catch(error: any) {
        newcomerLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating newcomer");
    }
}

export async function removeNewcomerTask(newcomerId: number): Promise<Newcomer> {
    try {
        const newcomer = await getNewcomerByIdTask(newcomerId);
        newcomer.deleted = true;
        const deletedNewcomer = await newcomerRepository.save(newcomer);
        return deletedNewcomer;

    } catch(error: any) {
        newcomerLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting newcomer");
    }
}

export async function updateNewcomerTask(newcomer: Newcomer, data: Newcomer): Promise<Newcomer> {
    return setNewcomerData(newcomer, data);
}

async function setNewcomerData(newcomer: Newcomer, data: Newcomer): Promise<Newcomer> {
    if (data.firstName) {
        newcomer.firstName = data.firstName
    }

    if (data.lastName) {
        newcomer.lastName = data.lastName
    }
    
    if (data.email) {
        const existingNewcomer = await getNewcomerByEmailTask(data.email);

        // TODO Need to perform validation if the email is valid.

        if (existingNewcomer !== null && (existingNewcomer.id !== data.id)) {
            throw new HTTPBadRequestError("Email taken")
        }

        newcomer.email = data.email
    }

    if (data.status) {
        newcomer.status = data.status
    }

    try {
        const updatedNewcomer = await newcomerRepository.save(newcomer);

        return updatedNewcomer;

    } catch (error: any) {
        newcomerLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when setting newcomer data");

    }
}
