import Express from "express";
import { getUser, registerUser, deleteUser, patchUser, profilelogin } from "./user.controller"
import { verify } from "../authentication/auth.middleware"

function userRoutes(app: Express.Application) {
    app.get("/api/v0/user/:id", verify, getUser)
    app.delete("/api/v0/user/:id",verify, deleteUser)
    app.patch("/api/v0/user", verify, patchUser)
    app.post("/api/v0/register", registerUser)
    app.post("/api/v0/login", profilelogin)
}

export default userRoutes;