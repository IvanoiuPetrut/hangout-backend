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
  const user = await prisma.user.findUnique({
    where: {
      id: senderId,
    },
    select: {
      username: true,
    },
  });

  if (chatRoomId) {
    data = {
      senderName: user.username,
      senderId,
      receiverId,
      senderPhoto,
      chatRoomId,
      content,
    };
  } else {
    data = {
      senderName: user.username,
      senderId,
      receiverId,
      senderPhoto,
      content,
    };
  }

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
