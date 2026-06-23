const mongoose = require('mongoose');
const Topic = require('../models/Topic');

exports.getToday = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // due today OR overdue (and not mastered)
    const topics = await Topic.find({
      user: req.userId,
      status: { $ne: 'Mastered' },
      nextRevisionDate: { $lte: endOfDay },
    })
      .populate('subject', 'name')
      .sort({ nextRevisionDate: 1 });

    res.json(topics);
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const counts = await Topic.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusCounts = {
      'Not Started': 0,
      'Learned': 0,
      'Revision 1': 0,
      'Revision 2': 0,
      'Mastered': 0,
    };
    counts.forEach((c) => {
      statusCounts[c._id] = c.count;
    });

    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    const masteredPercent = total === 0 ? 0 : Math.round((statusCounts['Mastered'] / total) * 100);

    res.json({ statusCounts, total, masteredPercent });
  } catch (err) {
    next(err);
  }
};
