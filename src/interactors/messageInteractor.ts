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

async function createChatRoomInteractor(
  { createChatRoomPersistence },
  { id, userIds }
) {
  const chatRoom = await createChatRoomPersistence({
    id,
    userIds,
  });
  return chatRoom;
}

async function getMessagesFromChatRoomInteractor(
  { getMessagesFromChatRoomPersistence },
  { chatRoomId, userId }
) {
  const messages = await getMessagesFromChatRoomPersistence({
    chatRoomId,
    userId,
  });
  return messages;
}

export {
  createMessageInteractor,
  createChatRoomInteractor,
  getMessagesFromChatRoomInteractor,
};
