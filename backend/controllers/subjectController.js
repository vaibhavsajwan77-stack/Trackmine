const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

exports.createSubject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const subject = await Subject.create({ user: req.userId, name, description });
    res.status(201).json(subject);
  } catch (err) {
    next(err);
  }
};

exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ user: req.userId }).sort({ createdAt: -1 });

    // attach progress % per subject
    const withProgress = await Promise.all(
      subjects.map(async (s) => {
        const total = await Topic.countDocuments({ subject: s._id });
        const mastered = await Topic.countDocuments({ subject: s._id, status: 'Mastered' });
        const progress = total === 0 ? 0 : Math.round((mastered / total) * 100);
        return { ...s.toObject(), totalTopics: total, progress };
      })
    );

    res.json(withProgress);
  } catch (err) {
    next(err);
  }
};

exports.getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.userId });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    next(err);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    next(err);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    await Topic.deleteMany({ subject: subject._id });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    next(err);
  }
};
