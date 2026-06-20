import express from "express";
import { ROLES } from "../../constants.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { getTasks, createATask } from "./controllers.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize(ROLES.USER, ROLES.ADMIN), getTasks);
router.post("/", authorize(ROLES.USER), createATask);

export default router;
