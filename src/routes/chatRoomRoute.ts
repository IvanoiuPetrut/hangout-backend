import express from "express";
const router = express.Router();

import {
  createChatRoom,
  getJoinedRooms,
} from "../controllers/chatRoomController.js";

router.post("/create", createChatRoom);
router.get("/joined", getJoinedRooms);

export { router as chatRoomRouter };
