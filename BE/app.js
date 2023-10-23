import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";
import { connection } from "./connection.js";

const env = dotenv.config().parsed;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", apiRouter);
app.use((req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});

// MongoDbConnection
connection();

app.listen(env.APP_PORT, () => {
  console.log(`SERVER RUNING ON PORT  ${env.APP_PORT}`);
});
