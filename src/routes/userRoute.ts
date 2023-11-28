import express from "express";
const router = express.Router();

import { createUser, getUserById } from "../controllers/userController.js";

router.post("/create", createUser);
router.get("/:id", getUserById);

export { router as userRouter };
