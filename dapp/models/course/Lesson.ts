import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'quiz'], required: true },
  videoUrl: String,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  order: { type: Number, required: true },
}, { timestamps: true })

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema)
