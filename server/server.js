import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
dotenv.config();

import chatRoutes from "./routes/chatRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { chunkText } from "./utils/chunkText.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cors());
await connectDB();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("api is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


