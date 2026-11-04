import * as userService from "./user.service.js";

export const getProfile = async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
};

export const updateProfile = async (req, res) => {
  const user = await userService.updateUserProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user },
  });
};

export const updateAvatar = async (req, res) => {
  const user = await userService.updateUserAvatar(
    req.user.id,
    req.body.avatarUrl,
  );

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    data: { user },
  });
};

export const deleteUser = async (req, res) => {
  await userService.deleteUserById(req.user.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};

export const getByEmail = async (req, res) => {
  const user = await userService.getUserByEmail(req.params.email);

  res.status(200).json({
    success: true,
    data: { user },
  });
};
