import Express from "express";
import { getActivity, deleteActivity, patchActivity, createActivity } from "./activity.controller"
import { verify } from "../authentication/auth.middleware"

function activityRoutes(app: Express.Application) {
    app.get("/api/v0/activity/:id", verify, getActivity)
    app.delete("/api/v0/activity/:id", verify, deleteActivity)
    app.patch("/api/v0/activity/:id", verify, patchActivity)
    app.post("/api/v0/activity", verify, createActivity)
}

export default activityRoutes;