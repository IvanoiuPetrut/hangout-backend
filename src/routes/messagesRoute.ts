import express from "express";
import multer from "multer";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

import {
  getMessagesFromChatRoom,
  getMessagesFromFriendChatRoom,
  uploadFile,
  summarizeMessages,
} from "../controllers/messagesController.js";

router.get("/:chatRoomId", getMessagesFromChatRoom);
router.get("/friend/:friendId", getMessagesFromFriendChatRoom);
router.post("/upload-file", upload.single("file"), uploadFile);
router.post("/summarize", summarizeMessages);

export { router as messagesRouter };
