import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";
import { validateUserId } from "../validation/user.js";
import { generateFriendsChatRoomId } from "../helpers/helpers.js";
import OpenAI from "openai";

import {
  getMessagesFromChatRoomInteractor,
  createMessageInteractor,
  createChatRoomFriendsInteractor,
  uploadFileInteractor,
} from "../interactors/messageInteractor.js";

import {
  getMessagesFromChatRoomPersistence,
  createMessagePersistence,
  createChatRoomFriendsPersistence,
  uploadFilePersistence,
} from "../persistance/messagePersistence.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

async function uploadFile(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileUrl = await uploadFileInteractor(
      { uploadFilePersistence },
      { file }
    );
    res.json({ fileUrl: fileUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function summarizeMessages(req: Request, res: Response) {
  const messages = req.body.messages;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).send({ error: "Invalid messages format" });
  }
  try {
    const messagesText = messages
      .map((msg) => `Sender name: ${msg.name} and content: ${msg.content}`)
      .join("\n");
    messages.reverse();

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Summarize the following messages in one sentence:",
        },
        { role: "user", content: messagesText },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 100,
      n: 1,
    });

    const summary = response.choices[0].message.content;
    res.send({ summary });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).send({ error: "Error summarizing messages" });
  }
}

export {
  getMessagesFromChatRoom,
  getMessagesFromFriendChatRoom,
  createMessage,
  createChatRoomFriends,
  uploadFile,
  summarizeMessages,
};
