class UserEntity {
  private _name: string;
  private _password: string;
  private _id?: number;

  constructor(name: string, password: string) {
    this._name = name;
    this._password = password;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  validate() {
    if (this._name.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    if (this._password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
  }
}

export default UserEntity;
