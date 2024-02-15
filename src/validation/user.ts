import validator from "validator";

function validateUsername(username: string): void {
  if (validator.isAlphanumeric(username) === false) {
    throw new Error("Username must be alphanumeric");
  }
}

function validateUserId(id: string): void {
  if (validator.isUUID(id) === false) {
    throw new Error("User id must be an UUID");
  }
}

function validateUser(id: string, username: string): void {
  validateUserId(id);
  validateUsername(username);
}

function validateUserCode(code: string): void {
  if (validator.isUUID(code) === false) {
    throw new Error("Code must be a UUID");
  }
}

export { validateUser, validateUserId, validateUserCode };
