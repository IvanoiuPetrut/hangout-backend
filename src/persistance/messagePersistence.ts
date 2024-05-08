import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createMessagePersistence({
  senderId,
  receiverId,
  senderPhoto,
  chatRoomId,
  content,
}) {
  let data;
  if (chatRoomId) {
    data = {
      senderId,
      receiverId,
      senderPhoto,
      chatRoomId,
      content,
    };
  } else {
    data = {
      senderId,
      receiverId,
      senderPhoto,
      content,
    };
  }

  console.log("data:", data);
  const message = await prisma.message.create({
    data,
  });
  return message;
}

async function createChatRoomFriendsPersistence({ id, userIds }) {
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
  createChatRoomFriendsPersistence,
  getMessagesFromChatRoomPersistence,
};
