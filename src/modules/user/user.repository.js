import User from "./user.model.js";

export const createUser = async (data) => {
  return User.create(data);
};

export const findUserById = async (userId) => {
  return User.findById(userId);
};

export const findUserByEmail = async (
  email,
  { includePassword = false } = {},
) => {
  const query = User.findOne({ email: email.toLowerCase() });

  if (includePassword) {
    query.select("+password");
  }
  return query;
};

export const updateUserById = async (userId, data) => {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
};

export const findAllUsers = async ({
  page = 1,
  limit = 10,
  filter = {},
  sort = "-createdAt",
} = {}) => {
  const [items, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    User.countDocuments(filter),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const deleteById = async (userId) => {
  return User.findByIdAndDelete(userId);
};
