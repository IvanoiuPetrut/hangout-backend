import { generateFriendsChatRoomId } from "../helpers/helpers.js";
import {
  createMessage,
  createChatRoomFriends,
} from "../controllers/messagesController.js";
import { getUserId } from "../middleware/verifyUser.js";
import { Socket, Server } from "socket.io";

type createFriendChatPayload = {
  userToken: string;
  friendId: string;
};

type friendChatMessagePayload = {
  userToken: string;
  friendId: string;
  senderPhoto: string;
  message: string;
};

async function handleCreateFriendChat(
  socket: Socket,
  payload: createFriendChatPayload
) {
  const senderId = await getUserId(payload.userToken);
  const userIds = [senderId, payload.friendId];
  const chatRoomId = generateFriendsChatRoomId(senderId, payload.friendId);
  await createChatRoomFriends(chatRoomId, userIds);
  socket.join(chatRoomId);
}

async function leaveFriendChat(socket: Socket, payload: any) {
  const senderId = await getUserId(payload.userToken);
  const chatRoomId = generateFriendsChatRoomId(senderId, payload.friendId);
  socket.leave(chatRoomId);
}

async function handleFriendChatMessage(
  io: Server,
  payload: friendChatMessagePayload
) {
  const senderId = await getUserId(payload.userToken);
  const chatRoomId = generateFriendsChatRoomId(senderId, payload.friendId);
  const message = {
    senderId: senderId,
    receiverId: payload.friendId,
    senderPhoto: payload.senderPhoto,
    chatRoomId: chatRoomId,
    content: payload.message,
  };

  const messagePersistance = await createMessage(
    message.senderId,
    message.receiverId,
    message.senderPhoto,
    message.chatRoomId,
    message.content
  );
  io.in(chatRoomId).emit("friendChatMessage", messagePersistance);
}

async function joinChatRoomSocket(socket: Socket, payload: any) {
  console.log("joinChatRoomSocket:", socket.id, payload.chatRoomId);
  socket.join(payload.chatRoomId);
}

async function leaveChatRoomSocket(socket: Socket, payload: any) {
  console.log("leaveChatRoomSocket:", socket.id, payload.chatRoomId);
  socket.leave(payload.chatRoomId);
}

async function handleChatRoomChatMessage(io: Server, payload: any) {
  const senderId = await getUserId(payload.userToken);
  const chatRoomId = payload.chatRoomId;

  const message = {
    senderId: senderId,
    receiverId: "none",
    senderPhoto: payload.senderPhoto,
    chatRoomId: chatRoomId,
    content: payload.message,
  };

  const messagePersistance = await createMessage(
    message.senderId,
    message.receiverId,
    message.senderPhoto,
    message.chatRoomId,
    message.content
  );

  io.in(chatRoomId).emit("chatRoomChatMessage", messagePersistance);
}

export {
  handleCreateFriendChat,
  leaveFriendChat,
  handleFriendChatMessage,
  createFriendChatPayload,
  friendChatMessagePayload,
  handleChatRoomChatMessage,
  joinChatRoomSocket,
  leaveChatRoomSocket,
};
