import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    timeBetweenToasts: { type: Number, default: 3 },
    toastDisplayTime: { type: Number, default: 5 },
    position: { type: String, default: 'bottom-right' },
    backgroundColor: { type: String, default: '#ffffff' },
    typography: { type: String, default: 'Inter, sans-serif' },
    interactiveDismissal: { type: Boolean, default: true },
    brandedSignature: { type: Boolean, default: true },
    loopCycle: { type: Boolean, default: true }
});

export default mongoose.model('Settings', SettingsSchema);
