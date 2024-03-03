import { Request, Response } from "express";
import {
  validateUser,
  validateUserId,
  validateUserCode,
  validateUsername,
} from "../validation/user.js";

import {
  createUserInteractor,
  getUserByIdInteractor,
  getUserDetailsInteractor,
  updateUserDetailsInteractor,
  getUsersInteractor,
} from "../interactors/userInteractor.js";

import {
  UserDto,
  createUserPersistence,
  getUserByIdPersistence,
  getUserDetailsPersistence,
  updateUserDetailsPersistence,
  getUsersPersistence,
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
  const id = req.params.id || (await getUserId(accessToken));

  try {
    validateUserId(id);

    const user = await getUserDetailsInteractor(
      { getUserDetailsPersistence },
      { id }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateUserDetails(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const { username } = req.body;
  const id = await getUserId(accessToken);

  try {
    validateUsername(username);

    const user = await updateUserDetailsInteractor(
      { updateUserDetailsPersistence },
      { id, username }
    );
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

async function getUsers(req: Request, res: Response): Promise<void> {
  const { name } = req.query;
  const accessToken = req.headers["access-token"];
  const id = await getUserId(accessToken);

  try {
    validateUsername(name as string);

    const users = await getUsersInteractor(
      { getUsersPersistence },
      { name, id }
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { createUser, getUserById, getUserDetails, updateUserDetails, getUsers };
