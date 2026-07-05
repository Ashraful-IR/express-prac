import users from "../data/users.js";

function getUserById(id) {
  return users.find((user) => user.id === id) ?? null;
}

function getNextUserId() {
  const highestId = users.reduce((maxId, user) => Math.max(maxId, user.id), 0);
  return highestId + 1;
}

function createUser(userData) {
  const user = {
    id: getNextUserId(),
    name: userData.name,
    email: userData.email,
    age: userData.age,
    city: userData.city,
    country: userData.country,
  };

  users.push(user);
  return user;
}

function updateUser(id, userData) {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = {
    ...users[userIndex],
    ...userData,
  };

  return users[userIndex];
}

function deleteUser(id) {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  const [deletedUser] = users.splice(userIndex, 1);
  return deletedUser;
}

function getAllUsers() {
  return users;
}

export { createUser, deleteUser, getUserById, updateUser, getAllUsers };
