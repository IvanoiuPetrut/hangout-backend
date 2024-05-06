import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";
import { validateUserId } from "../validation/user.js";
import { validateRoomName } from "../validation/general.js";

import {
  createChatRoomInteractor,
  getJoinedRoomsInteractor,
  sendInviteToRoomInteractor,
  getInvitesInteractor,
  acceptInviteInteractor,
  rejectInviteInteractor,
  getUsersThatCanBeInvitedInteractor,
  getRoomsWhereUserIsNotMemberInteractor,
  kickUserInteractor,
} from "../interactors/chatRoomInteractor.js";
import {
  createChatRoomPersistence,
  getJoinedRoomsPersistence,
  sendInviteToRoomPersistence,
  getInvitesPersistence,
  acceptInvitePersistence,
  rejectInvitePersistence,
  getUsersThatCanBeInvitedPersistence,
  getRoomsWhereUserIsNotMemberPersistence,
  kickUserPersistence,
} from "../persistance/chatRoomPersistence.js";

async function createChatRoom(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const roomName = req.body.roomName;
  const userId = await getUserId(accessToken);

  try {
    validateUserId(userId);
    validateRoomName(roomName);

    const chatRoom = await createChatRoomInteractor(
      { createChatRoomPersistence },
      { name: roomName, userId }
    );

    res.json(chatRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getJoinedRooms(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);

  try {
    validateUserId(userId);

    const rooms = await getJoinedRoomsInteractor(
      { getJoinedRoomsPersistence },
      { userId }
    );

    res.json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function sendInviteToRoom(req: Request, res: Response): Promise<void> {
  const { invitedUserId, chatRoomId } = req.body;
  const userId = await getUserId(req.headers["access-token"]);

  try {
    validateUserId(invitedUserId);
    validateUserId(chatRoomId);

    const invite = await sendInviteToRoomInteractor(
      { sendInviteToRoomPersistence },
      { userId, chatRoomId, invitedUserId }
    );
    res.status(200).json(invite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getInvites(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);

  try {
    validateUserId(userId);

    const invites = await getInvitesInteractor(
      { getInvitesPersistence },
      { userId }
    );

    res.json(invites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function acceptInvite(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);
  const inviteId = req.params.inviteId;

  try {
    validateUserId(userId);
    validateUserId(inviteId);

    await acceptInviteInteractor(
      { acceptInvitePersistence },
      { userId, inviteId }
    );

    res.status(200).json({ message: "Invite accepted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function rejectInvite(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);
  const inviteId = req.params.inviteId;

  try {
    validateUserId(userId);
    validateUserId(inviteId);

    await rejectInviteInteractor(
      { rejectInvitePersistence },
      { userId, inviteId }
    );

    res.status(200).json({ message: "Invite rejected" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getUsersThatCanBeInvited(
  req: Request,
  res: Response
): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);
  const chatRoomId = req.params.chatRoomId;
  const { name } = req.query;

  try {
    validateUserId(userId);
    validateUserId(chatRoomId);

    const users = await getUsersThatCanBeInvitedInteractor(
      { getUsersThatCanBeInvitedPersistence },
      { userId, chatRoomId, name }
    );

    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getRoomsWhereUserIsNotMember(
  req: Request,
  res: Response
): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = req.params.userId;
  const ownerId = await getUserId(accessToken);

  try {
    validateUserId(userId);

    const rooms = await getRoomsWhereUserIsNotMemberInteractor(
      { getRoomsWhereUserIsNotMemberPersistence },
      { ownerId, userId }
    );

    res.json(rooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function kickUser(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);
  const { chatRoomId, userToKickId } = req.body;

  try {
    validateUserId(userId);
    validateUserId(chatRoomId);
    validateUserId(userToKickId);

    await kickUserInteractor(
      { kickUserPersistence },
      { userId, chatRoomId, userToKickId }
    );

    res.status(200).json({ message: "User kicked" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export {
  createChatRoom,
  getJoinedRooms,
  sendInviteToRoom,
  getInvites,
  acceptInvite,
  rejectInvite,
  getUsersThatCanBeInvited,
  getRoomsWhereUserIsNotMember,
  kickUser,
};
