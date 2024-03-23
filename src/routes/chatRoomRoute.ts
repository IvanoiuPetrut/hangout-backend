import express from "express";
const router = express.Router();

import { createChatRoom } from "../controllers/chatRoomController.js";

router.post("/create", createChatRoom);

export { router as chatRoomRouter };
