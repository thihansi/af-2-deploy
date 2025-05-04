import User from "../models/userModel.js";
import { validatePassword } from "../utils/passwordValidator.js";

export const createUser = async ({ username, email, password }) => {
  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.message);
  }
  
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // Create and save user
  const user = new User({ username, email, password });
  return await user.save();
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  return user;
};