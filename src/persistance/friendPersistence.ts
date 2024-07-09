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
  const receiverFriendRelation = await prisma.friends.create({
    data: {
      User: {
        connect: {
          id: receiverId,
        },
      },
      friendId: senderId,
    },
  });

  await prisma.friends.create({
    data: {
      User: {
        connect: {
          id: senderId,
        },
      },
      friendId: receiverId,
    },
  });
  return receiverFriendRelation;
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

async function getFriendsPersistence({ userId }) {
  const friendsIds = await prisma.friends.findMany({
    where: {
      userId,
    },
    include: {
      User: false,
    },
  });
  const friends = [];
  for (const friendId of friendsIds) {
    const friend = await prisma.user.findUnique({
      where: {
        id: friendId.friendId,
      },
    });
    friends.push(friend);
  }
  return friends;
}

async function deleteFriendPersistence(userId, friendId) {
  await prisma.friends.deleteMany({
    where: {
      userId,
      friendId,
    },
  });
  await prisma.friends.deleteMany({
    where: {
      userId: friendId,
      friendId: userId,
    },
  });

  await prisma.friendRequests.deleteMany({
    where: {
      from: userId,
      to: friendId,
    },
  });

  await prisma.friendRequests.deleteMany({
    where: {
      from: friendId,
      to: userId,
    },
  });
}

export {
  createFriendRequestPersistence,
  getFriendRequestPersistence,
  getPendingFriendRequestPersistence,
  acceptFriendRequestPersistence,
  declineFriendRequestPersistence,
  getFriendsPersistence,
  deleteFriendPersistence,
};
