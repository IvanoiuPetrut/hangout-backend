import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";
import { validateUserId } from "../validation/user.js";
import { validateRoomName } from "../validation/general.js";
import { createChatRoomInteractor } from "../interactors/chatRoomInteractor.js";

import { createChatRoomPersistence } from "../persistance/chatRoomPersistence.js";

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

export { createChatRoom };
