import mongoose from 'mongoose'

const QuizSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  passingScore: { type: Number, default: 60 }, // %
  timeLimit: Number, // in minutes
}, { timestamps: true })

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema)
