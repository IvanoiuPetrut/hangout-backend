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

async function sendInviteToRoomPersistence({
  userId,
  chatRoomId,
  invitedUserId,
}) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      ownerId: userId,
    },
  });

  if (!chatRoom) {
    throw new Error("You are not the owner of the chat room");
  }

  const user = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      members: {
        some: {
          id: invitedUserId,
        },
      },
    },
  });

  // TODO moderator should be able to invite users

  if (user) {
    throw new Error("User is already a member of the chat room");
  }

  const invite = await prisma.chatRoomInvites.create({
    data: {
      chatRoomId: chatRoomId,
      toUserId: invitedUserId,
      status: "pending",
    },
  });
  return invite;
}

async function getInvitesPersistence({ userId }) {
  const invites = await prisma.chatRoomInvites.findMany({
    where: {
      toUserId: userId,
      status: "pending",
    },
  });
  const invitesWithRoom = [];
  for (const invite of invites) {
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: invite.chatRoomId,
      },
    });
    const newInvite = { ...invite, roomName: room.name };
    invitesWithRoom.push(newInvite);
  }
  return invitesWithRoom;
}

async function acceptInvitePersistence({ userId, inviteId }) {
  const invite = await prisma.chatRoomInvites.findFirst({
    where: {
      id: inviteId,
      toUserId: userId,
    },
  });

  if (!invite) {
    throw new Error("Invite not found");
  }

  await prisma.chatRoomInvites.update({
    where: {
      id: inviteId,
    },
    data: {
      status: "accepted",
    },
  });

  await prisma.chatRoom.update({
    where: {
      id: invite.chatRoomId,
    },
    data: {
      members: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

async function rejectInvitePersistence({ userId, inviteId }) {
  const invite = await prisma.chatRoomInvites.findFirst({
    where: {
      id: inviteId,
      toUserId: userId,
    },
  });

  if (!invite) {
    throw new Error("Invite not found");
  }

  await prisma.chatRoomInvites.update({
    where: {
      id: inviteId,
    },
    data: {
      status: "rejected",
    },
  });
}

async function getUsersThatCanBeInvitedPersistence({
  userId,
  chatRoomId,
  name,
}) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      ownerId: userId,
    },
  });

  if (!chatRoom) {
    throw new Error("You are not the owner of the chat room");
  }

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: name,
      },
      NOT: {
        OR: [
          {
            chatRooms: {
              some: {
                id: chatRoomId,
              },
            },
          },
        ],
      },
    },
  });

  //check if user is already a member of the chat room or has a pending invite

  return users;
}

async function getRoomsWhereUserIsNotMemberPersistence({ ownerId, userId }) {
  const rooms = await prisma.chatRoom.findMany({
    where: {
      NOT: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      AND: {
        ownerId: ownerId,
      },
    },
  });
  const newRooms = [];
  const userChatRoomInvites = await prisma.chatRoomInvites.findMany({
    where: {
      toUserId: userId,
      status: "pending",
    },
  });

  for (const room of rooms) {
    const invite = userChatRoomInvites.find(
      (invite) => invite.chatRoomId === room.id
    );
    if (!invite) {
      newRooms.push(room);
    }
  }
  return newRooms;
}

async function kickUserPersistence({ userId, chatRoomId, kickedUserId }) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      ownerId: userId,
    },
  });

  console.log("kickUser pers", userId, chatRoomId, kickedUserId);

  if (!chatRoom) {
    throw new Error("You are not the owner of the chat room");
  }

  const user = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      members: {
        some: {
          id: kickedUserId,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User is not a member of the chat room");
  }

  await prisma.chatRoom.update({
    where: {
      id: chatRoomId,
    },
    data: {
      members: {
        disconnect: {
          id: kickedUserId,
        },
      },
    },
  });
}

async function getChatRoomDetailsPersistence({ chatRoomId, userId }) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      members: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      owner: true,
      members: true,
      messages: true,
    },
  });

  if (!chatRoom) {
    throw new Error("You are not a member of the chat room");
  }

  return chatRoom;
}

async function editChatRoomNamePersistence({ userId, chatRoomId, name }) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      ownerId: userId,
    },
  });

  if (!chatRoom) {
    throw new Error("You are not the owner of the chat room");
  }

  const updatedChatRoom = await prisma.chatRoom.update({
    where: {
      id: chatRoomId,
    },
    data: {
      name,
    },
  });

  return updatedChatRoom;
}

async function editChatRoomDescriptionPersistence({
  userId,
  chatRoomId,
  description,
}) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      ownerId: userId,
    },
  });

  if (!chatRoom) {
    throw new Error("You are not the owner of the chat room");
  }

  const updatedChatRoom = await prisma.chatRoom.update({
    where: {
      id: chatRoomId,
    },
    data: {
      description,
    },
  });

  return updatedChatRoom;
}

async function leaveChatRoomPersistence({ userId, chatRoomId }) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      members: {
        some: {
          id: userId,
        },
      },
    },
  });

  if (!chatRoom) {
    throw new Error("You are not a member of the chat room");
  }

  await prisma.chatRoom.update({
    where: {
      id: chatRoomId,
    },
    data: {
      members: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
}

async function deleteChatRoomPersistence({ userId, chatRoomId }) {
  const chatRoom = await prisma.chatRoom.findFirst({
    where: {
      id: chatRoomId,
      ownerId: userId,
    },
  });

  if (!chatRoom) {
    throw new Error("You are not the owner of the chat room");
  }

  await prisma.chatRoom.delete({
    where: {
      id: chatRoomId,
    },
  });
}

export {
  createChatRoomPersistence,
  getJoinedRoomsPersistence,
  sendInviteToRoomPersistence,
  getInvitesPersistence,
  acceptInvitePersistence,
  rejectInvitePersistence,
  getUsersThatCanBeInvitedPersistence,
  kickUserPersistence,
  getRoomsWhereUserIsNotMemberPersistence,
  getChatRoomDetailsPersistence,
  editChatRoomNamePersistence,
  editChatRoomDescriptionPersistence,
  leaveChatRoomPersistence,
  deleteChatRoomPersistence,
};
