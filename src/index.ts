import express from "express";
import cors from "cors";
import "dotenv/config";
import { userRouter } from "./routes/userRoute.js";
import { friendRouter } from "./routes/friendRoute.js";
import { messagesRouter } from "./routes/messagesRoute.js";
import { chatRoomRouter } from "./routes/chatRoomRoute.js";
import {
  getUserId,
  verifyTokens,
  verifyTokenSocket,
} from "./middleware/verifyUser.js";

import {
  handleCreateFriendChat,
  leaveFriendChat,
  handleFriendChatMessage,
  createFriendChatPayload,
  friendChatMessagePayload,
  handleChatRoomChatMessage,
  joinChatRoomSocket,
  leaveChatRoomSocket,
} from "./sockets/messages.js";

import { Server } from "socket.io";
import http from "http";
import https from "https";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

// const whitelist = ["http://localhost:5173"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

//console log COGNITO_CLIENT_ID,COGNITO_USER_POOL_ID from env
console.log("client id: ", process.env.COGNITO_CLIENT_ID);
console.log("user pool id: ", process.env.COGNITO_USER_POOL_ID);

app.use(cors());
app.use(express.json());
app.use(verifyTokens);
app.use("/user", userRouter);
app.use("/friend", friendRouter);
app.use("/messages", messagesRouter);
app.use("/chat-room", chatRoomRouter);

// const server = http.createServer(app);
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port} :)`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const isAuthenticated = await verifyTokenSocket(token);
  if (isAuthenticated) {
    return next();
  }
  return next(new Error("Authentication error"));
});

type chatRoomUsers = {
  id: string;
  socketId: string;
  name: string;
  photo: string;
};

type chatRooms = {
  chatRoomId: string;
  users: chatRoomUsers[];
};

const chatRooms: chatRooms[] = [];

io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log("user connected", socket.id);
  });

  socket.on("friendChatMessage", async (payload: friendChatMessagePayload) => {
    handleFriendChatMessage(io, payload);
  });

  socket.on("createFriendChat", async (payload: createFriendChatPayload) => {
    handleCreateFriendChat(socket, payload);
  });

  socket.on("leaveFriendChat", async (payload: any) => {
    leaveFriendChat(socket, payload);
  });

  socket.on("chatRoomChatMessage", async (payload: any) => {
    handleChatRoomChatMessage(io, payload);
  });

  socket.on("joinChatRoom", async (chatRoomId: string) => {
    joinChatRoomSocket(socket, chatRoomId);
  });

  socket.on("leaveChatRoom", async (chatRoomId: string) => {
    leaveChatRoomSocket(socket, chatRoomId);
  });

  socket.on(
    "joinVoiceRoom",
    async (payload: {
      chatRoomId: string;
      userName: string;
      userPhoto: string;
    }) => {
      const userToken = socket.handshake.auth.token;
      const userId = await getUserId(userToken);
      socket.join(payload.chatRoomId + "-voice");
      console.log(
        "joinVoiceRoom",
        payload.chatRoomId,
        userId,
        payload.userName
      );
      const chatRoom = chatRooms.find(
        (chatRoom) => chatRoom.chatRoomId === payload.chatRoomId
      );
      if (chatRoom) {
        chatRoom.users.push({
          id: userId,
          socketId: socket.id,
          name: payload.userName,
          photo: payload.userPhoto,
        });
      } else {
        chatRooms.push({
          chatRoomId: payload.chatRoomId,
          users: [
            {
              id: userId,
              socketId: socket.id,
              name: payload.userName,
              photo: payload.userPhoto,
            },
          ],
        });
      }
      const newChatRoom = chatRooms.find(
        (chatRoom) => chatRoom.chatRoomId === payload.chatRoomId
      );
      io.in(payload.chatRoomId + "-voice").emit(
        "userJoinedVoiceRoom",
        newChatRoom.users
      );
    }
  );

  socket.on("leaveVoiceRoom", async (payload: { chatRoomId: string }) => {
    const userToken = socket.handshake.auth.token;
    const userId = await getUserId(userToken);
    const chatRoom = chatRooms.find(
      (chatRoom) => chatRoom.chatRoomId === payload.chatRoomId
    );
    if (chatRoom) {
      const userIndex = chatRoom.users.findIndex((user) => user.id === userId);
      if (userIndex > -1) {
        chatRoom.users.splice(userIndex, 1);
      }
      socket
        .to(payload.chatRoomId + "-voice")
        .emit("userLeftVoiceRoom", chatRoom.users);
    }
  });

  socket.on(
    "sendIceCandidate",
    async (payload: {
      iceCandidate: any;
      chatRoomId: string;
      forUserId: string;
    }) => {
      console.log("sendIceCandidate");
      const userId = await getUserId(socket.handshake.auth.token);
      const socketId = chatRooms
        .find((chatRoom) => chatRoom.chatRoomId === payload.chatRoomId)
        ?.users.find((user) => user.id === payload.forUserId)?.socketId;
      socket.to(socketId).emit("receiveIceCandidate", {
        iceCandidate: payload.iceCandidate,
        userId: userId,
      });
    }
  );

  socket.on(
    "sendIceCandidateToTheOferrer",
    async (payload: {
      iceCandidate: any;
      chatRoomId: string;
      toSocketId: string;
    }) => {
      console.log("sendIceCandidateToTheOferrer");
      const userId = await getUserId(socket.handshake.auth.token);
      socket.to(payload.toSocketId).emit("receiveIceCandidate", {
        iceCandidate: payload.iceCandidate,
        userId: userId,
      });
    }
  );

  socket.on(
    "sendOffer",
    async (payload: { offer: any; chatRoomId: string; forUserId: string }) => {
      console.log("sendOffer");
      const userId = await getUserId(socket.handshake.auth.token);
      const socketId = chatRooms
        .find((chatRoom) => chatRoom.chatRoomId === payload.chatRoomId)
        ?.users.find((user) => user.id === payload.forUserId)?.socketId;
      socket.to(socketId).emit("receiveOffer", {
        offer: payload.offer,
        socketId: socket.id,
        userId: userId,
      });
    }
  );

  socket.on(
    "sendAnswer",
    async (payload: { answer: any; toSocketId: string }) => {
      console.log("sendAnswer");
      const userId = await getUserId(socket.handshake.auth.token);
      socket.to(payload.toSocketId).emit("receiveAnswer", {
        answer: payload.answer,
        socketId: socket.id,
        userId: userId,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    chatRooms.forEach((chatRoom) => {
      const userIndex = chatRoom.users.findIndex(
        (user) => user.socketId === socket.id
      );
      if (userIndex > -1) {
        chatRoom.users.splice(userIndex, 1);
        io.in(chatRoom.chatRoomId + "-voice").emit(
          "userLeftVoiceRoom",
          chatRoom.users
        );
      }
    });
    console.log("chatRooms", chatRooms);
  });

  socket.on(
    "kickUser",
    async (payload: { chatRoomId: string; userId: string }) => {
      io.in(payload.chatRoomId).emit("userKicked", { userId: payload.userId });
    }
  );
});
