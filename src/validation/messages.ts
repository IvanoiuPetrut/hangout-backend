import validator from "validator";

function validateMessageContent(content: string): void {
  if (validator.isAscii(content) === false) {
    throw new Error("Message content must be ASCII");
  }
}

export { validateMessageContent };
