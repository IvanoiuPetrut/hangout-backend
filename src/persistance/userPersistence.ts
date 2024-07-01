import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const prisma = new PrismaClient();

export type UserDto = {
  id: string;
  username: string;
  photo: string;
};

type UserPersistence = {
  id: number;
  username: string;
  password: string;
};

type CreateUserPersistenceArgs = {
  username: string;
  password: string;
};

type GetUserByIdPersistenceArgs = {
  id: number;
};

async function createUserPersistence({ id, username }) {
  console.log(id);
  console.log(username);
  const user = await prisma.user.create({
    data: {
      id,
      username,
    },
  });
  return user;
}

async function getUserByIdPersistence({ id }: GetUserByIdPersistenceArgs) {
  // const user = await prisma.user.findUnique({
  //   where: {
  //     id,
  //   },
  // });
  // const userDto = mapUserPersistenceToUserDto(user);
  // return userDto;
}

async function getUserDetailsPersistence({ id }) {
  let user;
  user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    user = createUserPersistence({ id, username: id });
  }
  return user;
}

async function updateUserDetailsPersistence({ id, username }) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
    },
  });
  return user;
}

async function getUsersPersistence({ name, id }) {
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: name,
      },
      NOT: {
        id: id,
      },
    },
  });
  return users;
}

async function updateUserProfilePicturePersistence({ userId, file }) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: userId + "." + file.mimetype.split("/")[1],
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.log(error);
  }

  const fileName = `https://${
    process.env.AWS_BUCKET_NAME
  }.s3.amazonaws.com/${userId}.${file.mimetype.split("/")[1]}`;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      photo: fileName,
    },
  });

  await prisma.message.updateMany({
    where: {
      senderId: userId,
    },
    data: {
      senderPhoto: fileName,
    },
  });

  return user;
}

export {
  createUserPersistence,
  getUserByIdPersistence,
  getUserDetailsPersistence,
  updateUserDetailsPersistence,
  getUsersPersistence,
  updateUserProfilePicturePersistence,
};
