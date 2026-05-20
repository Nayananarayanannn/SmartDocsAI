import { Router } from "express";
import { chatQuestion } from "../controllers/chatController.js";

const router = Router();

router.post("/", chatQuestion);

export default router;
