import UserEntity from "../entities/userEntity.js";
async function createUserInteractor({ createUserPersistence }, { username, password }) {
    const user = new UserEntity(username, password);
    user.validate();
    await createUserPersistence({ username: user.name, password: user.password });
    return user;
}
export { createUserInteractor };
//# sourceMappingURL=userInteractor.js.map