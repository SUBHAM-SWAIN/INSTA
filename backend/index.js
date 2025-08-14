import dotenv from "dotenv";
dotenv.config({});
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.rout.js";
import postRoutes from "./routes/post.route.js";
import messageRoutes from "./routes/message.rout.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("request accepted");
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

//apis
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);
// "http://localhost:8000/api/v1/user/register";

app.listen(PORT, () => {
  console.log(`app is listening @ ${PORT}`);
  connectDB();
});
