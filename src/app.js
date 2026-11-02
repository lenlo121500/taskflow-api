import express from "express";
import morgan from "morgan";
import { morganStream } from "../config/logger.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: morganStream,
    skip: (req) => req.url === "/health",
  }),
);

// ...routes

app.use(errorMiddleware); // last

export default app;
