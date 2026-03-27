import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  followers: Number,
  likes: Number,
  posts: Number
});

const accountSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  metrics: [metricSchema],
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Account', accountSchema);