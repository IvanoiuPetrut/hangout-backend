import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";
import { validateUserId } from "../validation/user.js";
import { validateMessageContent } from "../validation/messages.js";

import {
  getMessagesFromChatRoomInteractor,
  createMessageInteractor,
  createChatRoomInteractor,
} from "../interactors/messageInteractor.js";

import {
  getMessagesFromChatRoomPersistence,
  createMessagePersistence,
  createChatRoomPersistence,
} from "../persistance/messagePersistence.js";

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

async function createMessage(
  senderId: string,
  receiverId: string,
  chatRoomId: string,
  content: string
) {
  try {
    validateUserId(senderId);
    validateUserId(receiverId);
    validateMessageContent(content);

    await createMessageInteractor(
      { createMessagePersistence },
      { senderId, receiverId, chatRoomId, content }
    );
  } catch (error) {
    console.log("error:", error);
  }
}

async function createChatRoom(chatRoomId: string, userIds: Array<string>) {
  try {
    await createChatRoomInteractor(
      { createChatRoomPersistence },
      { id: chatRoomId, userIds }
    );
  } catch (error) {
    console.log("error:", error);
  }
}

export {
  getMessagesFromChatRoom,
  getMessagesFromFriendChatRoom,
  createMessage,
  createChatRoom,
};
