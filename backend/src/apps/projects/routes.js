import express from "express";
import { ROLES } from "../../config/const.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { validateId } from "../../middleware/validateId.js";
import {
    createProject,
    getProjects,
    getAProject,
    editProject,
    deleteProject,
} from "./controllers.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize(ROLES.USER, ROLES.ADMIN), getProjects);
router.get("/:id", validateId, authorize(ROLES.USER, ROLES.ADMIN), getAProject);
router.post("/", authorize(ROLES.USER), createProject);
router.put("/:id", validateId, authorize(ROLES.USER), editProject);
router.delete("/:id", validateId, authorize(ROLES.USER), deleteProject);

export default router;
