import validator from "validator";

const validateUsername = (username: string): void => {
  if (validator.isAlphanumeric(username) === false) {
    throw new Error("Username must be alphanumeric");
  }
};

const validatePassword = (password: string): void => {
  if (validator.isStrongPassword(password) === false) {
    throw new Error("Password must be strong");
  }
};

const validateUserId = (id: number): void => {
  if (validator.isInt(String(id)) === false) {
    throw new Error("User id must be an integer");
  }
};

const validateUser = (username: string, password: string): void => {
  validateUsername(username);
  validatePassword(password);
};

export { validateUser, validateUserId };
