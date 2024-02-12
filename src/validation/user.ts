import validator from "validator";

function validateUsername(username: string): void {
  if (validator.isAlphanumeric(username) === false) {
    throw new Error("Username must be alphanumeric");
  }
}

function validatePassword(password: string): void {
  if (validator.isStrongPassword(password) === false) {
    throw new Error("Password must be strong");
  }
}

function validateUserId(id: number): void {
  if (validator.isInt(String(id)) === false) {
    throw new Error("User id must be an integer");
  }
}

function validateUser(username: string, password: string): void {
  validateUsername(username);
  validatePassword(password);
}

function validateUserCode(code: string): void {
  if (validator.isUUID(code) === false) {
    throw new Error("Code must be a UUID");
  }
}

export { validateUser, validateUserId, validateUserCode };
