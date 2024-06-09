import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createMessagePersistence({
  senderId,
  receiverId,
  senderPhoto,
  chatRoomId,
  content,
}) {
  let data;
  const user = await prisma.user.findUnique({
    where: {
      id: senderId,
    },
    select: {
      username: true,
    },
  });

  if (chatRoomId) {
    data = {
      senderName: user.username,
      senderId,
      receiverId,
      senderPhoto,
      chatRoomId,
      content,
    };
  } else {
    data = {
      senderName: user.username,
      senderId,
      receiverId,
      senderPhoto,
      content,
    };
  }

  const message = await prisma.message.create({
    data,
  });
  return message;
}

async function createChatRoomFriendsPersistence({ id, userIds }) {
  const chatRoom = await prisma.chatRoom.create({
    data: {
      id,
      name: id,
      members: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
  return chatRoom;
}

async function getMessagesFromChatRoomPersistence({ chatRoomId, userId }) {
  const messages = await prisma.message.findMany({
    where: {
      chatRoomId,
      AND: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    },
  });
  return messages;
}

async function uploadFilePersistence({ file }) {
  const uuid = uuidv4();
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uuid + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    const response = await s3Client.send(command);
    const itemUrl = `https://${
      process.env.AWS_BUCKET_NAME
    }.s3.eu-central-1.amazonaws.com/${uuid + file.originalname}`;
    return itemUrl;
  } catch (error) {
    console.log("error", error);
  }
}

export {
  createMessagePersistence,
  createChatRoomFriendsPersistence,
  getMessagesFromChatRoomPersistence,
  uploadFilePersistence,
};
