import express from "express";
const router = express.Router();

import {
  createChatRoom,
  getJoinedRooms,
  sendInviteToRoom,
  getInvites,
  acceptInvite,
  rejectInvite,
  getUsersThatCanBeInvited,
  getRoomsWhereUserIsNotMember,
  kickUser,
} from "../controllers/chatRoomController.js";

router.post("/create", createChatRoom);
router.get("/joined", getJoinedRooms);
router.post("/send-invite", sendInviteToRoom);
router.get("/invites", getInvites);
router.post("/accept-invite/:inviteId", acceptInvite);
router.post("/reject-invite/:inviteId", rejectInvite);
router.get("/users-that-can-be-invited", getUsersThatCanBeInvited);
router.get(
  "/rooms-where-user-is-not-member/:userId",
  getRoomsWhereUserIsNotMember
);
router.get("/test/:userId", (req, res) => {
  const userId = req.params.userId;
  res.json({ message: "Hello from chat room route", userId });
});
router.post("/kick-user", kickUser);

export { router as chatRoomRouter };
