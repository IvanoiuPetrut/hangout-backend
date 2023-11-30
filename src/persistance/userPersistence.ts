import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UserDto = {
  id: number;
  username: string;
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

function mapUserPersistenceToUserDto(user: UserPersistence): UserDto {
  return {
    id: user.id,
    username: user.username,
  };
}

async function createUserPersistence({
  username,
  password,
}: CreateUserPersistenceArgs): Promise<UserDto> {
  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });
  const userDto = mapUserPersistenceToUserDto(user);
  return userDto;
}

async function getUserByIdPersistence({
  id,
}: GetUserByIdPersistenceArgs): Promise<UserDto> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  const userDto = mapUserPersistenceToUserDto(user);
  return userDto;
}

export { createUserPersistence, getUserByIdPersistence };
