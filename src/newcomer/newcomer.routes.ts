import Express from "express";
import { getNewcomer, deleteNewcomer, patchNewcomer, createNewcomer } from "./newcomer.controller"
import { verify } from "../authentication/auth.middleware"

function newcomerRoutes(app: Express.Application) {
    app.get("/api/v0/newcomer", verify, getNewcomer)
    app.delete("/api/v0/newcomer", verify, deleteNewcomer)
    app.patch("/api/v0/newcomer", verify, patchNewcomer)
    app.post("/api/v0/newcomer", verify, createNewcomer)
}

export default newcomerRoutes;