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

export { createChatRoomInteractor, getJoinedRoomsInteractor };
