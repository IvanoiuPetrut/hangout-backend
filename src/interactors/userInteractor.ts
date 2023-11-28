import UserEntity from "../entities/userEntity.js";

async function createUserInteractor(
  { createUserPersistence },
  { username, password }
) {
  const user = new UserEntity(username, password);
  user.validate();
  const userDto = await createUserPersistence({
    username: user.name,
    password: user.password,
  });
  user.id = userDto.id;
  return user;
}

async function getUserByIdInteractor({ getUserByIdPersistence }, { id }) {
  const user = await getUserByIdPersistence({ id });
  return user;
}

export { createUserInteractor, getUserByIdInteractor };
