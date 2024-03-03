import { Request, Response } from "express";
import { getUserId } from "../middleware/verifyUser.js";

import { validateUserId } from "../validation/user.js";

import {
  createFriendRequestInteractor,
  getFriendRequestInteractor,
  getPendingFriendRequestInteractor,
  acceptFriendRequestInteractor,
  declineFriendRequestInteractor,
} from "../interactors/friendInteractor.js";

import {
  createFriendRequestPersistence,
  getFriendRequestPersistence,
  getPendingFriendRequestPersistence,
  acceptFriendRequestPersistence,
  declineFriendRequestPersistence,
} from "../persistance/friendPersistence.js";

async function createFriendRequest(req: Request, res: Response): Promise<void> {
  const { receiverId } = req.body;
  const accessToken = req.headers["access-token"];
  const senderId = await getUserId(accessToken);

  try {
    validateUserId(senderId);
    validateUserId(receiverId);

    const friendRequest = await createFriendRequestInteractor(
      { createFriendRequestPersistence },
      { senderId, receiverId }
    );

    res.json(friendRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getFriendRequest(req: Request, res: Response): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);

  try {
    validateUserId(userId);

    const friendRequest = await getFriendRequestInteractor(
      { getFriendRequestPersistence },
      { userId }
    );

    res.json(friendRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getPendingFriendRequest(
  req: Request,
  res: Response
): Promise<void> {
  const accessToken = req.headers["access-token"];
  const userId = await getUserId(accessToken);

  try {
    validateUserId(userId);

    const friendRequest = await getPendingFriendRequestInteractor(
      { getPendingFriendRequestPersistence },
      { userId }
    );

    res.json(friendRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function acceptFriendRequest(req: Request, res: Response): Promise<void> {
  const { senderId } = req.body;
  const accessToken = req.headers["access-token"];
  const receiverId = await getUserId(accessToken);

  try {
    validateUserId(senderId);
    validateUserId(receiverId);

    const friendRequest = await acceptFriendRequestInteractor(
      { acceptFriendRequestPersistence },
      { senderId, receiverId }
    );

    res.json(friendRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function declineFriendRequest(
  req: Request,
  res: Response
): Promise<void> {
  const { senderId } = req.body;
  const accessToken = req.headers["access-token"];
  const receiverId = await getUserId(accessToken);

  try {
    validateUserId(senderId);
    validateUserId(receiverId);

    const friendRequest = await declineFriendRequestInteractor(
      { declineFriendRequestPersistence },
      { senderId, receiverId }
    );

    res.json(friendRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export {
  createFriendRequest,
  getFriendRequest,
  getPendingFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
};
