import { User } from "@prisma/client";
import UserEntity from "../entities/userEntity.js";
import { UserDto } from "../persistance/userPersistence.js";

async function createUserInteractor(
  { createUserPersistence },
  { username, password }
): Promise<UserDto> {
  const user = new UserEntity(username, password);
  user.validate();
  const userDto: UserDto = await createUserPersistence({
    username: user.name,
    password: user.password,
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

export { createUserInteractor, getUserByIdInteractor };
