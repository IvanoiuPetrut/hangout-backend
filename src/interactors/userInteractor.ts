import { User } from "@prisma/client";
import UserEntity from "../entities/userEntity.js";
import { UserDto } from "../persistance/userPersistence.js";

async function createUserInteractor(
  { createUserPersistence },
  { id, username }
): Promise<UserDto> {
  const userDto: UserDto = await createUserPersistence({
    id,
    username,
  });
  return userDto;
}

async function getUserByIdInteractor(
  { getUserByIdPersistence },
  { id }
): Promise<UserDto> {
  const userDto: UserDto = await getUserByIdPersistence({ id });
  return userDto;
}

async function getUserDetailsInteractor(
  { getUserDetailsPersistence },
  { id }
): Promise<UserDto> {
  const userDto: UserDto = await getUserDetailsPersistence({ id });
  return userDto;
}

async function updateUserDetailsInteractor(
  { updateUserDetailsPersistence },
  { id, username }
): Promise<UserDto> {
  const userDto: UserDto = await updateUserDetailsPersistence({ id, username });
  return userDto;
}

export {
  createUserInteractor,
  getUserByIdInteractor,
  getUserDetailsInteractor,
  updateUserDetailsInteractor,
};
