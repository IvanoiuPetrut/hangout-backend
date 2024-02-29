import { PrismaClient } from "@prisma/client";

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

async function getUsersPersistence({ name }) {
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: name,
      },
    },
  });
  return users;
}

export {
  createUserPersistence,
  getUserByIdPersistence,
  getUserDetailsPersistence,
  updateUserDetailsPersistence,
  getUsersPersistence,
};
