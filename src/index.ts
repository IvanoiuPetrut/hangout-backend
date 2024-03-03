import express from "express";
import cors from "cors";
import "dotenv/config";
import { userRouter } from "./routes/userRoute.js";
import { friendRouter } from "./routes/friendRoute.js";
import { verifyTokens } from "./middleware/verifyUser.js";

const app = express();
const port = process.env.PORT || 3000;

// const whitelist = ["http://localhost:5173"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(cors());

app.use(express.json());
app.use(verifyTokens);
app.use("/user", userRouter);
app.use("/friend", friendRouter);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
