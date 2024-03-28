import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";
import { validateUserId } from "../validation/user.js";
import { validateRoomName } from "../validation/general.js";

import {
  createChatRoomInteractor,
  getJoinedRoomsInteractor,
} from "../interactors/chatRoomInteractor.js";
import {
  createChatRoomPersistence,
  getJoinedRoomsPersistence,
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

export { createChatRoom, getJoinedRooms };
