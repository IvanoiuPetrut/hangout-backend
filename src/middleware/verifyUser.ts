import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

async function verifyTokens(req, res, next) {
  const accessToken = req.headers["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Missing tokens" });
  }

  try {
    const payload = await verifier.verify(accessToken);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid tokens" });
  }
}

async function getUserId(accessToken) {
  const payload = await verifier.verify(accessToken);
  return payload.sub;
}

export { verifyTokens, getUserId };
