import mongoose from 'mongoose'

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  currentLessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  progress: { type: Number, default: 0 },
  quizScores: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
      score: Number,
      completedAt: Date,
    }
  ],
  certificateIssued: { type: Boolean, default: false },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  stakingAmount: { type: Number, default: 0 },
  role: { type: String, default: 'student' },
  status: { type: String, enum: ['active', 'withdrawn', 'completed'], default: 'active' },
  timeSpent: { type: Number, default: 0 },
  lastActiveAt: { type: Date },
  deviceInfo: { type: String },
})

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema)
