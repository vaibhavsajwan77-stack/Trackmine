const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { advanceTopic } = require('../utils/scheduler');

exports.createTopic = async (req, res, next) => {
  try {
    const { subjectId, title, notes } = req.body;
    if (!subjectId || !title) {
      return res.status(400).json({ message: 'subjectId and title are required' });
    }

    const subject = await Subject.findOne({ _id: subjectId, user: req.userId });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const topic = await Topic.create({
      user: req.userId,
      subject: subjectId,
      title,
      notes: notes || '',
    });

    res.status(201).json(topic);
  } catch (err) {
    next(err);
  }
};

exports.getTopicsBySubject = async (req, res, next) => {
  try {
    const topics = await Topic.find({
      subject: req.params.subjectId,
      user: req.userId,
    }).sort({ createdAt: -1 });
    res.json(topics);
  } catch (err) {
    next(err);
  }
};

exports.updateTopic = async (req, res, next) => {
  try {
    const { title, notes } = req.body;
    const topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { title, notes } },
      { new: true, runValidators: true }
    );
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    next(err);
  }
};

exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json({ message: 'Topic deleted' });
  } catch (err) {
    next(err);
  }
};

// Core spaced-repetition action: mark topic as revised -> auto schedule next date
exports.markRevised = async (req, res, next) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, user: req.userId });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const update = advanceTopic(topic.status);
    Object.assign(topic, update);
    await topic.save();

    res.json(topic);
  } catch (err) {
    next(err);
  }
};

exports.getWeakTopics = async (req, res, next) => {
  try {
    const now = new Date();

    // overdue: has a scheduled date in the past and not Mastered -> mark weak
    await Topic.updateMany(
      {
        user: req.userId,
        nextRevisionDate: { $lt: now },
        status: { $ne: 'Mastered' },
      },
      { $set: { isWeak: true } }
    );

    const weakTopics = await Topic.find({ user: req.userId, isWeak: true })
      .populate('subject', 'name')
      .sort({ nextRevisionDate: 1 });

    res.json(weakTopics);
  } catch (err) {
    next(err);
  }
};
