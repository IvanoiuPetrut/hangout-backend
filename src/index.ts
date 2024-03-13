import express from "express";
import cors from "cors";
import "dotenv/config";
import { userRouter } from "./routes/userRoute.js";
import { friendRouter } from "./routes/friendRoute.js";
import { messagesRouter } from "./routes/messagesRoute.js";
import {
  verifyTokens,
  verifyTokenSocket,
  getUserId,
} from "./middleware/verifyUser.js";

import {
  createMessagePersistence,
  createChatRoomPersistence,
} from "./persistance/messagePersistence.js";
import {
  createMessageInteractor,
  createChatRoomInteractor,
} from "./interactors/messageInteractor.js";

import { Server } from "socket.io";
import http from "http";

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

app.use(cors());

app.use(express.json());
app.use(verifyTokens);
app.use("/user", userRouter);
app.use("/friend", friendRouter);
app.use("/messages", messagesRouter);

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
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

type createFriendChatPayload = {
  userToken: string;
  friendId: string;
};

type friendChatMessagePayload = {
  userToken: string;
  friendId: string;
  message: string;
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.emit("message", "Hello from server!");

  socket.on("message", (message) => {
    console.log("message from client:", message);
    socket.emit("message", message);
  });

  socket.on("friendChatMessage", async (payload: friendChatMessagePayload) => {
    const senderId = await getUserId(payload.userToken);
    const userIds = [senderId, payload.friendId];
    userIds.sort();
    const chatRoomId = userIds.join("_");
    socket.to(chatRoomId).emit("friendChatMessage", payload.message);
    await createMessageInteractor(
      { createMessagePersistence },
      {
        senderId,
        receiverId: payload.friendId,
        chatRoomId,
        content: payload.message,
      }
    );
  });

  socket.on("createFriendChat", async (payload: createFriendChatPayload) => {
    const senderId = await getUserId(payload.userToken);
    const userIds = [senderId, payload.friendId];
    userIds.sort();
    const chatRoomId = userIds.join("_");
    socket.join(chatRoomId);
    try {
      await createChatRoomInteractor(
        { createChatRoomPersistence },
        {
          id: chatRoomId,
          firstUserId: senderId,
          secondUserId: payload.friendId,
        }
      );
    } catch (error) {
      console.log("error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  // Add more event handlers as needed
});
