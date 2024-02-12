import express from "express";
import "dotenv/config";
import { userRouter } from "./routes/userRoute.js";
import { verifyTokens } from "./middleware/verifyUser.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(verifyTokens);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
