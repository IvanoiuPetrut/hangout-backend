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

async function createChatRoomPersistence({ id, userIds }) {
  const chatRoom = await prisma.chatRoom.create({
    data: {
      id,
      name: id,
      members: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
  return chatRoom;
}

async function getMessagesFromChatRoomPersistence({ chatRoomId, userId }) {
  const messages = await prisma.message.findMany({
    where: {
      chatRoomId,
      AND: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    },
  });
  return messages;
}

export {
  createMessagePersistence,
  createChatRoomPersistence,
  getMessagesFromChatRoomPersistence,
};
