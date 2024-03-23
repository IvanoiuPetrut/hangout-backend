import { generateFriendsChatRoomId } from "../helpers/helpers.js";
import {
  createMessage,
  createChatRoomFriends,
} from "../controllers/messagesController.js";
import { getUserId } from "../middleware/verifyUser.js";

type createFriendChatPayload = {
  userToken: string;
  friendId: string;
};

type friendChatMessagePayload = {
  userToken: string;
  friendId: string;
  message: string;
};

async function handleCreateFriendChat(
  socket: any,
  payload: createFriendChatPayload
) {
  const senderId = await getUserId(payload.userToken);
  const userIds = [senderId, payload.friendId];
  const chatRoomId = generateFriendsChatRoomId(senderId, payload.friendId);
  await createChatRoomFriends(chatRoomId, userIds);
  socket.join(chatRoomId);
}

async function handleFriendChatMessage(
  socket: any,
  payload: friendChatMessagePayload
) {
  const senderId = await getUserId(payload.userToken);
  const chatRoomId = generateFriendsChatRoomId(senderId, payload.friendId);
  await createMessage(senderId, payload.friendId, chatRoomId, payload.message);
  socket.to(chatRoomId).emit("friendChatMessage", payload.message);
}

export {
  handleCreateFriendChat,
  handleFriendChatMessage,
  createFriendChatPayload,
  friendChatMessagePayload,
};
