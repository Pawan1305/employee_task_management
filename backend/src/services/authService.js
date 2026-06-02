const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const ALLOWED_ROLES = ['admin', 'employee'];

function validateRole(role) {
  if (!ALLOWED_ROLES.includes(role)) {
    const error = new Error('Role must be either admin or employee.');
    error.statusCode = 400;
    throw error;
  }
}

async function register({ name, email, password, role = 'employee' }) {
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required.');
    error.statusCode = 400;
    throw error;
  }

  validateRole(role);

  const existing = await userModel.findUserByEmail(email);
  if (existing) {
    const error = new Error('Email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return { id: userId, name, email, role };
}

async function login({ email, password }) {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: '8h',
  });

  return { token, user: payload };
}

module.exports = {
  register,
  login,
};