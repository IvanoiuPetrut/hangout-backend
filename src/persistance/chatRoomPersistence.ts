import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createChatRoomPersistence({ name, userId }) {
  const chatRoom = await prisma.chatRoom.create({
    data: {
      name,
      owner: { connect: { id: userId } },
      members: {
        connect: [{ id: userId }],
      },
    },
  });
  return chatRoom;
}

async function getJoinedRoomsPersistence({ userId }) {
  const rooms = await prisma.chatRoom.findMany({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
  });
  const roomsThatAreNotFriendChats = rooms.filter(
    (room) => room.name !== room.id
  );
  return roomsThatAreNotFriendChats;
}

export { createChatRoomPersistence, getJoinedRoomsPersistence };
