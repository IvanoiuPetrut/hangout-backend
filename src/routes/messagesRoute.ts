import express from "express";
const router = express.Router();

import {
  getMessagesFromChatRoom,
  getMessagesFromFriendChatRoom,
} from "../controllers/messagesController.js";

router.get("/:chatRoomId", getMessagesFromChatRoom);
router.get("/friend/:friendId", getMessagesFromFriendChatRoom);

export { router as messagesRouter };
