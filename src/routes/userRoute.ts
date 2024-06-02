import express from "express";
import multer from "multer";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

import {
  createUser,
  getUserById,
  getUserDetails,
  updateUserDetails,
  getUsers,
  createProfilePicture,
} from "../controllers/userController.js";

router.post("/create", createUser);
router.get("/id/:id", getUserById);
router.get("/details", getUserDetails);
router.get("/users", getUsers);
router.get("/details/:id", getUserDetails);
router.patch("/details", updateUserDetails);
router.post("/profile-picture", upload.single("file"), createProfilePicture);
export { router as userRouter };
