// models/Certificate.ts
import mongoose from "mongoose"

const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  courseTitle: { type: String, required: true },
  userName: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  txHash: { type: String, default: null },
  ipfsUrl: { type: String, default: null },
}, { timestamps: true })

export default mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema)
