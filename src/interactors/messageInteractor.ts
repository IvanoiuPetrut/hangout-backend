async function createMessageInteractor(
  { createMessagePersistence },
  { senderId, receiverId, senderPhoto, chatRoomId, content }
) {
  const message = await createMessagePersistence({
    senderId,
    receiverId,
    senderPhoto,
    chatRoomId,
    content,
  });
  return message;
}

async function createChatRoomFriendsInteractor(
  { createChatRoomFriendsPersistence },
  { id, userIds }
) {
  const chatRoom = await createChatRoomFriendsPersistence({
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

async function uploadFileInteractor({ uploadFilePersistence }, { file }) {
  const fileUrl = await uploadFilePersistence({ file });
  return fileUrl;
}

export {
  createMessageInteractor,
  createChatRoomFriendsInteractor,
  getMessagesFromChatRoomInteractor,
  uploadFileInteractor,
};
