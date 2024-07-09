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
    console.log(err);
    return res.status(401).json({ message: "Invalid tokens" });
  }
}

async function verifyTokenSocket(token) {
  try {
    await verifier.verify(token);
    return true;
  } catch (err) {
    return false;
  }
}

async function getUserId(accessToken) {
  try {
    const payload = await verifier.verify(accessToken);
    return payload.sub;
  } catch (err) {
    return null;
  }
}

export { verifyTokens, getUserId, verifyTokenSocket };
