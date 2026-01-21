import mongoose from 'mongoose';

const ToastSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    designation: { type: String },
    headline: { type: String },
    narrative: { type: String },
    cta: { type: String },
    url: { type: String },
    targetPages: { type: [String], default: ['*'] }, // '*' means all pages
    type: { type: String, default: 'Notification' },
    recurrence: { type: Number, default: 0 },
    status: { type: String, default: 'ACTIVE' },
    accentColor: { type: String, default: '#3b82f6' },
    position: { type: String, default: 'bottom-right' }, // bottom-right, bottom-left, top-right, top-left, top-center, bottom-center
    theme: { type: String, default: 'Light' }, // Light, Dark, Glass
    animation: { type: String, default: 'Slide' }, // Slide, Fade, Bounce
    backgroundColor: { type: String, default: '#ffffff' },
    startDelay: { type: Number, default: 0 }, // in seconds
    autoDismissTime: { type: Number, default: 0 }, // in seconds, 0 = no auto dismiss
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    dismissals: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Toast', ToastSchema);
