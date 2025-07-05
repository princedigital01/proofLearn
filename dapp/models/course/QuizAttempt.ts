import mongoose from 'mongoose'

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: Number,
  passed: Boolean,
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedAnswer: mongoose.Schema.Types.Mixed,
      correct: Boolean
    }
  ],
  completedAt: Date,
}, { timestamps: true })

export default mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema)
