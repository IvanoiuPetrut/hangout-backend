import express from "express";
const router = express.Router();

import {
  createUser,
  getUserById,
  getUserDetails,
  updateUserDetails,
  getUsers,
} from "../controllers/userController.js";

router.post("/create", createUser);
router.get("/id/:id", getUserById);
router.get("/details", getUserDetails);
router.get("/users", getUsers);
router.patch("/details", updateUserDetails);

export { router as userRouter };
