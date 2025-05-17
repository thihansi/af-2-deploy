import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { createUser, loginUser } from "../services/authService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    // Check for required fields
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide username, email and password" 
      });
    }

    const user = await createUser(req.body);
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    // MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    
    // Create tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token and user info
    res.json({
      accessToken,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      },
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);
    
    // Send new access token
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const checkAuthStatus = async (req, res) => {
  try {
    // If this route is protected by the auth middleware,
    // we already have req.userId
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  
  // Include avatar and favorites in the response
  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    favoriteCountries: user.favoriteCountries,
    createdAt: user.createdAt
  });
};