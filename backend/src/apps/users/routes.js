import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { registerHandler, loginHandler, meHandler } from "./controllers.js";

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/me", authenticate, meHandler);

export default router;
