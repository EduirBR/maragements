import express from "express";
import { ROLES } from "../../constants.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import {
    summary,
    projectsWithMostPendingTasks,
    tasksCompletedByPeriod,
} from "./controllers.js";

const router = express.Router();

router.use(authenticate);

router.get("/summary", authorize(ROLES.USER, ROLES.ADMIN), summary);
router.get(
    "/projects-most-pending",
    authorize(ROLES.USER, ROLES.ADMIN),
    projectsWithMostPendingTasks,
);
router.get(
    "/completed-tasks",
    authorize(ROLES.USER, ROLES.ADMIN),
    tasksCompletedByPeriod,
);

export default router;
