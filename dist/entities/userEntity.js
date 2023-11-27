class UserEntity {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
    validate() {
        if (this.name.length < 3) {
            throw new Error("Username must be at least 3 characters long");
        }
        if (this.password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }
    }
}
export default UserEntity;
//# sourceMappingURL=userEntity.js.map