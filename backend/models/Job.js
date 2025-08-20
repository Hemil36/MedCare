// filepath: d:\Projects\Queue\models.js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  result: {
    type: mongoose.Schema.Types.Mixed
  },
  error: {
    type: String
  }
});

export const Job = mongoose.model('Job', JobSchema);