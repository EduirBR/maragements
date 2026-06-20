import express from "express";
import usersRouter from "./apps/users/routes.js";
import projectsRouter from "./apps/projects/routes.js";
import taskRouter from "./apps/tasks/routes.js";
import reportsRouter from "./apps/reports/routes.js";

const appRouter = express.Router();

appRouter.use("/auth", usersRouter);
appRouter.use("/projects", projectsRouter);
appRouter.use("/tasks", taskRouter);
appRouter.use("/reports", reportsRouter);

export default appRouter;
