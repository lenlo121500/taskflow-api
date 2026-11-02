import mongoose from "mongoose";
import { createModuleLogger } from "./logger.js";
import { ENV_VARS } from "./envVars.js";

const logger = createModuleLogger("database");

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGODB_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed", {
      message: error.mesage,
    });
    throw error;
  }
};
