import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createFriendRequestPersistence({ senderId, receiverId }) {
  const friendRequest = await prisma.friendRequests.create({
    data: {
      from: senderId,
      to: receiverId,
    },
  });
  return friendRequest;
}

async function getFriendRequestPersistence({ userId }) {
  const friendRequest = await prisma.friendRequests.findMany({
    where: {
      from: userId,
    },
  });
  return friendRequest;
}

async function getPendingFriendRequestPersistence({ userId }) {
  const friendRequest = await prisma.friendRequests.findMany({
    where: {
      to: userId,
      status: "pending",
    },
  });
  return friendRequest;
}

async function acceptFriendRequestPersistence({ senderId, receiverId }) {
  await prisma.friendRequests.updateMany({
    where: {
      from: senderId,
      to: receiverId,
    },
    data: {
      status: "accepted",
    },
  });
  const friendRelation = await prisma.friends.create({
    data: {
      User: {
        connect: {
          id: receiverId,
        },
      },
      friendId: senderId,
    },
  });
  return friendRelation;
}

async function declineFriendRequestPersistence({ senderId, receiverId }) {
  await prisma.friendRequests.updateMany({
    where: {
      from: senderId,
      to: receiverId,
    },
    data: {
      status: "declined",
    },
  });
}

export {
  createFriendRequestPersistence,
  getFriendRequestPersistence,
  getPendingFriendRequestPersistence,
  acceptFriendRequestPersistence,
  declineFriendRequestPersistence,
};
