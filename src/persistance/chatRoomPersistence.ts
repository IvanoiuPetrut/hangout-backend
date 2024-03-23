import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createChatRoomPersistence({ name, userId }) {
  const chatRoom = await prisma.chatRoom.create({
    data: {
      name,
      members: {
        connect: [{ id: userId }],
      },
    },
  });
  return chatRoom;
}

export { createChatRoomPersistence };
