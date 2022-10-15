import Express from "express";
import { getNewcomer, deleteNewcomer, patchNewcomer, createNewcomer, searchNewcomers } from "./newcomer.controller"
import { verify } from "../authentication/auth.middleware"

function newcomerRoutes(app: Express.Application) {
    app.get("/api/v0/newcomer/:id", verify, getNewcomer)
    app.delete("/api/v0/newcomer/:id", verify, deleteNewcomer)
    app.patch("/api/v0/newcomer/:id", verify, patchNewcomer)
    app.post("/api/v0/newcomer", verify, createNewcomer)
    app.get("/api/v0/search/newcomer", verify, searchNewcomers)
}

export default newcomerRoutes;