import express from "express";
const router = express.Router();

import {
  createUser,
  getUserById,
  getUserDetails,
} from "../controllers/userController.js";

router.post("/create", createUser);
router.get("/id/:id", getUserById);
router.get("/details", getUserDetails);

export { router as userRouter };
