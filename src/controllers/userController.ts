import { Request, Response } from "express";
import {
  validateUser,
  validateUserId,
  validateUserCode,
} from "../validation/user.js";

import {
  createUserInteractor,
  getUserByIdInteractor,
} from "../interactors/userInteractor.js";

import {
  UserDto,
  createUserPersistence,
  getUserByIdPersistence,
} from "../persistance/userPersistence.js";

async function createUser(req: Request, res: Response): Promise<void> {
  console.log("createUser");
  const { username, password } = req.body;

  try {
    validateUser(username, password);

    const user: UserDto = await createUserInteractor(
      { createUserPersistence },
      { username, password }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getUserById(req: Request, res: Response): Promise<void> {
  console.log("getUserById");
  const id = Number(req.params.id);

  try {
    validateUserId(id);

    const user: UserDto = await getUserByIdInteractor(
      { getUserByIdPersistence },
      { id }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { createUser, getUserById };
