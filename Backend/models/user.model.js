import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  resetPassword: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
    lastAttemptAt: Date,
  },
  email: {
    type: String,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerification: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
    firstAttemptAt: Date,
  },
  unverifyEmail: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: {
    url: String,
    public_id: String,
  },
  bio: {
    type: String,
    default: 'Write your bio here...',
    maxlength: 300, // optional limit
  },
  loginHistory: [
    {
      timestamp: Date,
      ip: String,
      userAgent: String,
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ], likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
})

export const User = mongoose.model('User', userSchema)