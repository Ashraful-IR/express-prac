import {
  createUser,
  deleteUser,
  getUserById,
  getAllUsers as getAllUsersFromService,
  updateUser,
} from "../services/userService.js";

const userFields = ["name", "email", "age", "city", "country"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseUserId(rawId) {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}

function buildUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
    city: user.city,
    country: user.country,
  };
}

function validateUserPayload(payload, { partial = false } = {}) {
  const errors = [];
  const normalized = {};

  for (const field of userFields) {
    if (payload[field] === undefined) {
      if (!partial) {
        errors.push(`${field} is required`);
      }

      continue;
    }

    if (typeof payload[field] !== "string" && field !== "age") {
      if (field === "age" && typeof payload[field] === "number") {
        normalized.age = payload[field];
        continue;
      }

      errors.push(`${field} must be a string`);
      continue;
    }

    if (field === "age") {
      const age = Number(payload.age);

      if (!Number.isInteger(age) || age < 1) {
        errors.push("age must be a positive integer");
        continue;
      }

      normalized.age = age;
      continue;
    }

    const value = payload[field].trim();

    if (!value) {
      errors.push(`${field} cannot be empty`);
      continue;
    }

    if (field === "email" && !emailPattern.test(value)) {
      errors.push("email must be valid");
      continue;
    }

    normalized[field] = value;
  }

  if (partial && Object.keys(normalized).length === 0) {
    errors.push("At least one field is required");
  }

  return {
    errors,
    normalized,
  };
}

function getUserDetails(req, res) {
  const id = parseUserId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  const user = getUserById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: buildUserResponse(user),
  });
}

function getAllUsers(req, res) {
  const users = getAllUsersFromService();

  return res.status(200).json({
    success: true,
    data: users.map(buildUserResponse),
  });
}

function createUserHandler(req, res) {
  const { errors, normalized } = validateUserPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  const user = createUser(normalized);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: buildUserResponse(user),
  });
}

function updateUserHandler(req, res) {
  const id = parseUserId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  const { errors, normalized } = validateUserPayload(req.body, {
    partial: true,
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  const user = updateUser(id, normalized);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: buildUserResponse(user),
  });
}

function deleteUserHandler(req, res) {
  const id = parseUserId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  const user = deleteUser(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: buildUserResponse(user),
  });
}

export {
  createUserHandler,
  deleteUserHandler,
  getUserDetails,
  updateUserHandler,
  getAllUsers,
};
