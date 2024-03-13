async function createMessageInteractor(
  { createMessagePersistence },
  { senderId, receiverId, chatRoomId, content }
) {
  const message = await createMessagePersistence({
    senderId,
    receiverId,
    chatRoomId,
    content,
  });
  return message;
}

async function createChatRoomInteractor({ createChatRoomPersistence }, { id }) {
  const chatRoom = await createChatRoomPersistence({ id });
  return chatRoom;
}

export { createMessageInteractor, createChatRoomInteractor };
