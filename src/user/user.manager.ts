import { AppDataSource } from "../data-source"
import { User } from "../user/entity/User"
import { HTTPNotFoundError } from "../utils/error_handling/src/HTTPNotFoundError"
import { HTTPInternalSeverError } from "../utils/error_handling/src/HTTPInternalSeverError"
import userLogger from "./user.logger"
import { HTTPBadRequestError } from "../utils/error_handling/src/HTTPBadRequestError"
import { In } from "typeorm"

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();


const userRepository = AppDataSource.getRepository(User);

export async function getUserById(id: number): Promise<User> {
    try {
        const user = await userRepository.findOne({
            where: {
                id: id,
                deleted: false,
            }
        })
    
        if (!user) {
            throw new HTTPNotFoundError(`User id ${id} does not exist`);
        }
    
        return user
    } catch(error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when finding user by id");
    }
}

export async function getMultipleUserByIds(ids: Number[], selectOptions: Object = {}): Promise<User[]> {
    try {
        const users = await userRepository.find({
            select: selectOptions,
            where: {
                id: In(ids),
                deleted: false,
            }
        })
        
        return users
    } catch(error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when finding users by ids");

    }
}

export async function createUser(data: User): Promise<User> {
    try {
        const user = new User()

        await setNewUserData(user,data);

        await userRepository.save(user)

        return user;

    } catch(error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when creating new user");
    }
}

export async function removeUser(userId: number): Promise<User> {
    try {
        const user = await getUserById(userId);
        user.deleted = true;
        const deletedUser = await userRepository.save(user);
        return deletedUser;

    } catch(error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when deleting user");
    }
}

export async function updateUser(user: User, data: User): Promise<User> {
    return setUserData(user, data);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await userRepository.findOneBy({
            email: email,
            deleted: false,
        });
       
        return user
    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error while getting user by email");
    }
}

export async function login(user: User, password: string): Promise<object | null> {
    try {
        const successfulLogin = await bcrypt.compare(password, user.password);
        if (!successfulLogin) {
            return null
        } 

        const token = jwt.sign(
            { user_id: user.id },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );

        const refreshtoken = jwt.sign(
            { user_id: user.id },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        )

        const storeUserToken = updateRefreshToken(user.id, refreshtoken)

        if (!storeUserToken) {
            throw new HTTPInternalSeverError("Error while saving refresh token to user");
        }

        return {
            "Access token": token,
            "Refresh token": refreshtoken
        }

    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error during login");
    }
    
}

export async function refresh(refreshToken: string): Promise<object | null> {
    try {
        const decoded = jwt.verify(refreshToken, process.env.TOKEN_KEY);
        const userId = decoded.user_id
        const user = await getUserById(userId);
        
        if (refreshToken !== user.refreshToken) {
            throw new HTTPInternalSeverError("Suspicious activity");
        }

        const token = jwt.sign(
            { user_id: userId },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );

        const refreshtoken = jwt.sign(
            { user_id: userId },
            process.env.TOKEN_KEY,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        )

        const storeUserToken = updateRefreshToken(userId, refreshtoken)

        if (!storeUserToken) {
            throw new HTTPInternalSeverError("Error while saving refresh token to user");
        }

        return {
            "Access token": token,
            "Refresh token": refreshtoken
        }
        
    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw error;
    }
}

async function updateRefreshToken(userId: number, refreshToken: string): Promise<User> {
    try {
        const user = await getUserById(userId);
        user.refreshToken = refreshToken;

        const updatedUser = await userRepository.save(user);

        return updatedUser;

    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error while saving refresh token");
    }
}

async function setUserData(user: User, data: User): Promise<User> {
    if (data.firstName) {
        user.firstName = data.firstName
    }

    if (data.lastName) {
        user.lastName = data.lastName
    }
    
    if (data.email) {
        const existingUser = await getUserByEmail(data.email);

        // TODO Need to perform validation if the email is valid.

        if (existingUser !== null && (existingUser.id !== user.id)) {
            throw new HTTPBadRequestError("Email taken")
        }

        user.email = data.email
    }

    try {
        const updatedUser = await userRepository.save(user);

        return updatedUser;

    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when setting user data");

    }
}

async function setNewUserData(user: User, data: User): Promise<User> {

    if (data.firstName) {
        user.firstName = data.firstName
    }

    if (data.lastName) {
        user.lastName = data.lastName
    }
    
    if (data.email) {
        const existingUser = await getUserByEmail(data.email);
        if (existingUser !== null && (existingUser.id !== user.id)) {
            throw new HTTPBadRequestError("Email taken")
        }

        user.email = data.email
    }

    if (data.password) {
        user.password = encryptPassword(data.password);
    }

    try {
        const updatedUser = await userRepository.save(user);

        return updatedUser;

    } catch (error: any) {
        userLogger.log("error",`${error}`);
        throw new HTTPInternalSeverError("Error when setting user data");

    }
}
 
function encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT));
    return bcrypt.hashSync(password,  salt);
}