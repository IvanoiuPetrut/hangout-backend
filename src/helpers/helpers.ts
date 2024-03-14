import { v4 as uuidv4 } from "uuid";

function generateFriendsChatRoomId(senderId: string, receiverId: string) {
  const userIds = [senderId, receiverId].sort();
  return userIds.join("-");
}

function generateChatRoomId() {
  return uuidv4();
}

export { generateFriendsChatRoomId, generateChatRoomId };
