const mongoose = require('mongoose');

const STATUS = ['Not Started', 'Learned', 'Revision 1', 'Revision 2', 'Mastered'];

const topicSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    title: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: '' },
    status: { type: String, enum: STATUS, default: 'Not Started' },
    lastRevisedAt: { type: Date, default: null },
    nextRevisionDate: { type: Date, default: null },
    isWeak: { type: Boolean, default: false },
  },
  { timestamps: true }
);

topicSchema.statics.STATUS = STATUS;

module.exports = mongoose.model('Topic', topicSchema);
