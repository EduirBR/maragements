import express from "express";
import { ROLES } from "../../config/const.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { validateId } from "../../middleware/validateId.js";
import { getTasks, createATask, editATask, deleteATask } from "./controllers.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize(ROLES.USER, ROLES.ADMIN), getTasks);
router.post("/", authorize(ROLES.USER), createATask);
router.put("/:id", validateId, authorize(ROLES.USER), editATask);
router.delete("/:id", validateId, authorize(ROLES.USER), deleteATask);

export default router;
