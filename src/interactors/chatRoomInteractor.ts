async function createChatRoomInteractor(
  { createChatRoomPersistence },
  { name, userId }
) {
  const chatRoom = await createChatRoomPersistence({ name, userId });
  return chatRoom;
}

async function getJoinedRoomsInteractor(
  { getJoinedRoomsPersistence },
  { userId }
) {
  const rooms = await getJoinedRoomsPersistence({ userId });
  return rooms;
}

//   getUsersThatCanBeInvitedInteractor,
//   kickUserInteractor,

async function sendInviteToRoomInteractor(
  { sendInviteToRoomPersistence },
  { userId, chatRoomId, invitedUserId }
) {
  const invite = await sendInviteToRoomPersistence({
    userId,
    chatRoomId,
    invitedUserId,
  });
  return invite;
}

async function getInvitesInteractor({ getInvitesPersistence }, { userId }) {
  const invites = await getInvitesPersistence({ userId });
  return invites;
}

async function acceptInviteInteractor(
  { acceptInvitePersistence },
  { userId, inviteId }
) {
  const invite = await acceptInvitePersistence({ userId, inviteId });
  return invite;
}

async function rejectInviteInteractor(
  { rejectInvitePersistence },
  { userId, inviteId }
) {
  const invite = await rejectInvitePersistence({ userId, inviteId });
  return invite;
}

async function getUsersThatCanBeInvitedInteractor(
  { getUsersThatCanBeInvitedPersistence },
  { userId, chatRoomId, name }
) {
  const users = await getUsersThatCanBeInvitedPersistence({
    userId,
    chatRoomId,
    name,
  });
  return users;
}

async function getRoomsWhereUserIsNotMemberInteractor(
  { getRoomsWhereUserIsNotMemberPersistence },
  { ownerId, userId }
) {
  const rooms = await getRoomsWhereUserIsNotMemberPersistence({
    ownerId,
    userId,
  });
  return rooms;
}

async function kickUserInteractor(
  { kickUserPersistence },
  { userId, chatRoomId, userToKickId }
) {
  const chatRoom = await kickUserPersistence({
    userId,
    chatRoomId,
    userToKickId,
  });
  return chatRoom;
}

export {
  createChatRoomInteractor,
  getJoinedRoomsInteractor,
  sendInviteToRoomInteractor,
  getInvitesInteractor,
  acceptInviteInteractor,
  rejectInviteInteractor,
  getUsersThatCanBeInvitedInteractor,
  getRoomsWhereUserIsNotMemberInteractor,
  kickUserInteractor,
};
