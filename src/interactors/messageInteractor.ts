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
  { id, firstUserId, secondUserId }
) {
  const chatRoom = await createChatRoomPersistence({
    id,
    firstUserId,
    secondUserId,
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
