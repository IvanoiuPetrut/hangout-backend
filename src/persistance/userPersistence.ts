import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function createUserPersistence({ username, password }) {
  return prisma.user.create({
    data: {
      username,
      password,
    },
  });
}

function getUserByIdPersistence({ id }) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export { createUserPersistence, getUserByIdPersistence };
