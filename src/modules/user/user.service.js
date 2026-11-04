import * as userRepository from "./user.repository.js";
import APIError from "../../utils/APIError.js";
import { createModuleLogger } from "../../../config/logger.js";

const logger = createModuleLogger("user-service");

export const getUserProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user || !user.isActive) {
    throw new APIError(404, "User not found");
  }

  return user;
};

export const updateUserProfile = async (userId, data) => {
  const allowedUpdates = {};

  if (data.firstName !== undefined) {
    allowedUpdates.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    allowedUpdates.lastName = data.lastName;
  }

  if (data.avatarUrl !== undefined) {
    allowedUpdates.avatarUrl = data.avatarUrl;
  }

  const user = await userRepository.updateUserById(userId, allowedUpdates);

  if (!user || !user.isActive) {
    throw new APIError(404, "User not found");
  }

  return user;
};

export const getAllUsers = async () => {
  return await userRepository.findAllUsers({ isActive: true });
};

export const deactivateUser = async (userId) => {
  const user = await userRepository.updateUserById(userId, { isActive: false });

  if (!user || !user.isActive) {
    throw new APIError(404, "User not found");
  }

  return user;
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  const user = await userRepository.updateUserById(userId, { avatarUrl });

  // TODO: Add multer and cloudinary

  if (!user || !user.isActive) {
    throw new APIError(404, "User not found");
  }

  return user;
};

export const getUserById = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user || !user.isActive) {
    throw new APIError(404, "User not found");
  }

  return user;
};

export const getUserByEmail = async (email, options) => {
  return userRepository.findUserByEmail(email, options);
};

export const deleteUserById = async (userId) => {
  const user = await userRepository.deleteById(userId);

  if (!user || !user.isActive) {
    throw new APIError(404, "User not found");
  }

  logger.info("User deleted: ", { userId: id });
};
