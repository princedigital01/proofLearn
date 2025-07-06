import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  type: { type: String, enum: ['multiple-choice', 'true-false', 'fill-in-the-blank'],default: "multiple-choice",},
  text: { type: String, required: true },
  options: [String], // for MCQ
  correctAnswer: mongoose.Schema.Types.Mixed,
  explanation: String,
  order: { type: Number, required: true },
}, { timestamps: true })

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema)
