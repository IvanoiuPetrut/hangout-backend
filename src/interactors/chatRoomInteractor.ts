async function createChatRoomInteractor(
  { createChatRoomPersistence },
  { name, userId }
) {
  const chatRoom = await createChatRoomPersistence({ name, userId });
  return chatRoom;
}

export { createChatRoomInteractor };
