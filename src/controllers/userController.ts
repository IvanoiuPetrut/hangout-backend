import { Request, Response } from "express";

import { createUserInteractor } from "../interactors/userInteractor.js";
import { createUserPersistence } from "../persistance/userPersistence.js";

async function createUser(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    //Validate request body, needs implementation
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const user = await createUserInteractor(
      { createUserPersistence },
      { username, password }
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { createUser };
