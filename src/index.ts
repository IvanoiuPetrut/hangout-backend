import express from "express";
import cors from "cors";
import "dotenv/config";
import { userRouter } from "./routes/userRoute.js";
import { friendRouter } from "./routes/friendRoute.js";
import { messagesRouter } from "./routes/messagesRoute.js";
import { verifyTokens, verifyTokenSocket } from "./middleware/verifyUser.js";

import {
  handleCreateFriendChat,
  handleFriendChatMessage,
  createFriendChatPayload,
  friendChatMessagePayload,
} from "./sockets/messages.js";

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

io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log("user connected", socket.id);
  });

  socket.on("friendChatMessage", async (payload: friendChatMessagePayload) => {
    handleFriendChatMessage(socket, payload);
  });

  socket.on("createFriendChat", async (payload: createFriendChatPayload) => {
    handleCreateFriendChat(socket, payload);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
