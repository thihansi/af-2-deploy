import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { validatePassword } from "../utils/passwordValidator.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: function(password) {
        return validatePassword(password).isValid;
      },
      message: props => validatePassword(props.value).message
    }
  },
  avatar: { type: String, default: "lion" },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;