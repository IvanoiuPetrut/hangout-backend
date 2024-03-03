import express from "express";
const router = express.Router();

import {
  createFriendRequest,
  getFriendRequest,
  getPendingFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "../controllers/friendController.js";

router.post("/send-request", createFriendRequest);
router.get("/requests", getFriendRequest);
router.get("/requests/pending", getPendingFriendRequest);
router.post("/requests/accept", acceptFriendRequest);
router.post("/requests/decline", declineFriendRequest);

export { router as friendRouter };
