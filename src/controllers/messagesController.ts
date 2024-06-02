import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";
import { validateUserId } from "../validation/user.js";
import { generateFriendsChatRoomId } from "../helpers/helpers.js";

import {
  getMessagesFromChatRoomInteractor,
  createMessageInteractor,
  createChatRoomFriendsInteractor,
} from "../interactors/messageInteractor.js";

import {
  getMessagesFromChatRoomPersistence,
  createMessagePersistence,
  createChatRoomFriendsPersistence,
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
    const chatRoomId = generateFriendsChatRoomId(userId, friendId);

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
  senderPhoto: string,
  chatRoomId: string,
  content: string
) {
  try {
    validateUserId(senderId);
    if (receiverId !== "none") {
      validateUserId(receiverId);
    }

    const message = await createMessageInteractor(
      { createMessagePersistence },
      { senderId, receiverId, senderPhoto, chatRoomId, content }
    );
    return message;
  } catch (error) {
    console.log("error:", error);
  }
}

async function createChatRoomFriends(
  chatRoomId: string,
  userIds: Array<string>
) {
  try {
    await createChatRoomFriendsInteractor(
      { createChatRoomFriendsPersistence },
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
  createChatRoomFriends,
};
