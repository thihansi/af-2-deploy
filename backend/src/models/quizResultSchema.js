import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  quizDate: {
    type: Date,
    default: Date.now,
  },
  // Make this more flexible with fewer requirements
  questions: {
    type: Array,
    required: false,
    default: [],
  },
});

export const quizResultModel = mongoose.model("QuizResult", quizResultSchema);
