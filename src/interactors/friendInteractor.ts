async function createFriendRequestInteractor(
  { createFriendRequestPersistence },
  { senderId, receiverId }
) {
  const friendRequest = await createFriendRequestPersistence({
    senderId,
    receiverId,
  });
  return friendRequest;
}

async function getFriendRequestInteractor(
  { getFriendRequestPersistence },
  { userId }
) {
  const friendRequest = await getFriendRequestPersistence({ userId });
  return friendRequest;
}

async function getPendingFriendRequestInteractor(
  { getPendingFriendRequestPersistence },
  { userId }
) {
  const friendRequest = await getPendingFriendRequestPersistence({ userId });
  return friendRequest;
}

async function acceptFriendRequestInteractor(
  { acceptFriendRequestPersistence },
  { senderId, receiverId }
) {
  const friendRequest = await acceptFriendRequestPersistence({
    senderId,
    receiverId,
  });
  return friendRequest;
}

async function declineFriendRequestInteractor(
  { declineFriendRequestPersistence },
  { senderId, receiverId }
) {
  const friendRequest = await declineFriendRequestPersistence({
    senderId,
    receiverId,
  });
  return friendRequest;
}

export {
  createFriendRequestInteractor,
  getFriendRequestInteractor,
  getPendingFriendRequestInteractor,
  acceptFriendRequestInteractor,
  declineFriendRequestInteractor,
};
