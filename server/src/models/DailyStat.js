import mongoose from 'mongoose';

const DailyStatSchema = new mongoose.Schema({
    toastId: { type: mongoose.Schema.Types.ObjectId, ref: 'Toast', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    dismissals: { type: Number, default: 0 }
});

// Compound index to ensure unique entry per toast per day
DailyStatSchema.index({ toastId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyStat', DailyStatSchema);
