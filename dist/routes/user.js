import express from "express";
const router = express.Router();
import { createUser } from "../controllers/user.js";
router.post("/create", createUser);
export { router as userRouter };
//# sourceMappingURL=user.js.map