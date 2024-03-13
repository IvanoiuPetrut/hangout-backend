import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";
import { validateUserId } from "../validation/user.js";

import { getMessagesFromChatRoomInteractor } from "../interactors/messageInteractor.js";

import { getMessagesFromChatRoomPersistence } from "../persistance/messagePersistence.js";

async function getMessagesFromChatRoom(
  req: Request,
  res: Response
): Promise<void> {
  const accessToken = req.headers["access-token"];
  const chatRoomId = req.params.chatRoomId;
  const userId = await getUserId(accessToken);

  try {
    validateUserId(userId);

    const messages = await getMessagesFromChatRoomInteractor(
      { getMessagesFromChatRoomPersistence },
      { chatRoomId, userId }
    );

    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getMessagesFromFriendChatRoom(
  req: Request,
  res: Response
): Promise<void> {
  const accessToken = req.headers["access-token"];
  const friendId = req.params.friendId;
  const userId = await getUserId(accessToken);

  try {
    validateUserId(userId);
    validateUserId(friendId);
    const userIds = [userId, friendId].sort();
    const chatRoomId = userIds.join("_");

    const messages = await getMessagesFromChatRoomInteractor(
      { getMessagesFromChatRoomPersistence },
      { chatRoomId, userId }
    );

    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { getMessagesFromChatRoom, getMessagesFromFriendChatRoom };
