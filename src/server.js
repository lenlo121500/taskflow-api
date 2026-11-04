import "dotenv/config";
import app from "./app.js";
import { ENV_VARS } from "../config/envVars.js";
import logger from "../config/logger.js";
import { connectDB } from "../config/db.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV_VARS.PORT, () => {
      logger.info(`Server running on port ${ENV_VARS.PORT}`);
    });
  } catch (error) {
    logger.error("Application startup failed", {
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", {
    message: err.message,
    stack: err.stack,
  });

  process.exit(1);
});
