import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createMessagePersistence({
  senderId,
  receiverId,
  chatRoomId,
  content,
}) {
  let data;
  if (chatRoomId) {
    data = {
      senderId,
      receiverId,
      chatRoomId,
      content,
    };
  } else {
    data = {
      senderId,
      receiverId,
      content,
    };
  }

  console.log("data:", data);
  const message = await prisma.message.create({
    data,
  });
  return message;
}

async function createChatRoomPersistence({ id }) {
  const chatRoom = await prisma.chatRoom.create({
    data: {
      id,
      name: id,
    },
  });
  return chatRoom;
}

export { createMessagePersistence, createChatRoomPersistence };
