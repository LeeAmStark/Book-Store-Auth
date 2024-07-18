const { name } = require('ejs');
const fs = require('fs');
const path = require('path');
const { isEmail } = require('validator');

// Define the path to the JSON file
const filePath = path.join(__dirname, 'users.json');

const handleErrors = (errors) => {
  console.log("This is the error: " + errors.message, errors.code);
}

// Load users from the JSON file
const loadUsers = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// Save users to the JSON file
const saveUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Validate user sent data
const validateUser = (user) => {
  const errors = [];

  // Validate email
  if (!user.email || !isEmail(user.email)) {
    errors.push('Please enter a valid email');
  }

  // Check for duplicate email
  const users = loadUsers();
  if (users.some(u => u.email === user.email)) {
    errors.push('Email already exists');
  }

  if (user.username.length < 3) {
    errors.push('Username length should be more than or equal to 3');
  }

  if (users.some(u => u.username === user.username)) {
    errors.push('Username already exists');
  }

  // Validate password length
  if (!user.password || user.password.length < 3) {
    errors.push('Minimum length of password should be 3');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

// Add a user to the users.json
const addUser = (user) => {
  try {
    validateUser(user);
    const users = loadUsers();
    users.push(user);
    saveUsers(users);
  } catch (error) {
    handleErrors(error);
    throw error;  // Rethrow the error to be handled in the route
  }
};

// Get a user by email
const getUser = (email, username, password) => {
  const users = loadUsers();
  return users.find(user => user.username === username || user.email === email && user.password === password) || null;
};

// Get all users
const getUsers = () => {
  return loadUsers();
};

module.exports = { addUser, getUser, getUsers, handleErrors };
