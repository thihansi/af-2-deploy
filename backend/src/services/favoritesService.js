import User from "../models/userModel.js";

export const getFavoriteCountries = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user.favoriteCountries;
};

export const addToFavorites = async (userId, countryCode) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Check if already in favorites
  if (user.favoriteCountries.includes(countryCode)) {
    throw new Error("Country already in favorites");
  }

  user.favoriteCountries.push(countryCode);
  await user.save();
  return user.favoriteCountries;
};

export const removeFromFavorites = async (userId, countryCode) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Check if country is in favorites
  if (!user.favoriteCountries.includes(countryCode)) {
    throw new Error("Country not in favorites");
  }

  user.favoriteCountries = user.favoriteCountries.filter(
    code => code !== countryCode
  );
  
  await user.save();
  return user.favoriteCountries;
};