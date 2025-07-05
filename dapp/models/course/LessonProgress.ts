import mongoose from 'mongoose'

const LessonProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
}, { timestamps: true })

export default mongoose.models.LessonProgress || mongoose.model('LessonProgress', LessonProgressSchema)
