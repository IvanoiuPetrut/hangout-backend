import validator from "validator";

function validateUuid(uuid: string): void {
  if (validator.isUUID(uuid) === false) {
    throw new Error("UUID is not valid");
  }
}

export { validateUuid };
