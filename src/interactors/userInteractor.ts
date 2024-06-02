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

async function getUsersInteractor(
  { getUsersPersistence },
  { name, id }
): Promise<User[]> {
  const users: User[] = await getUsersPersistence({ name, id });
  return users;
}

async function updateUserProfilePictureInteractor(
  { updateUserProfilePicturePersistence },
  { userId, file }
): Promise<UserDto> {
  const userDto: UserDto = await updateUserProfilePicturePersistence({
    userId,
    file,
  });
  return userDto;
}

export {
  createUserInteractor,
  getUserByIdInteractor,
  getUserDetailsInteractor,
  updateUserDetailsInteractor,
  getUsersInteractor,
  updateUserProfilePictureInteractor,
};
