import express from "express";
import { ROLES } from "../../config/const.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import {
    summary,
    projectsWithMostPendingTasks,
    tasksCompletedByPeriod,
    tasksByStatus,
    productivityByDay,
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
router.get(
    "/tasks-by-status",
    authorize(ROLES.USER, ROLES.ADMIN),
    tasksByStatus,
);
router.get(
    "/productivity-by-day",
    authorize(ROLES.USER, ROLES.ADMIN),
    productivityByDay,
);

export default router;
