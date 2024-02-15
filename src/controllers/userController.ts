import { Request, Response } from "express";
import {
  validateUser,
  validateUserId,
  validateUserCode,
} from "../validation/user.js";

import {
  createUserInteractor,
  getUserByIdInteractor,
  getUserDetailsInteractor,
} from "../interactors/userInteractor.js";

import {
  UserDto,
  createUserPersistence,
  getUserByIdPersistence,
  getUserDetailsPersistence,
} from "../persistance/userPersistence.js";

import { getUserId } from "../middleware/verifyUser.js";

async function createUser(req: Request, res: Response): Promise<void> {
  const { id, username } = req.body;

  try {
    validateUser(id, username);

    const user = await createUserInteractor(
      { createUserPersistence },
      { id, username }
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
    // validateUserId(id);

    const user: UserDto = await getUserByIdInteractor(
      { getUserByIdPersistence },
      { id }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getUserDetails(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];

  try {
    const id = await getUserId(accessToken);

    const user = await getUserDetailsInteractor(
      { getUserDetailsPersistence },
      { id }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { createUser, getUserById, getUserDetails };
