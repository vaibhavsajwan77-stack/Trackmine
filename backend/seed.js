// Run with: node seed.js
// Creates one demo user + subject + topics across all statuses.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Subject = require('./models/Subject');
const Topic = require('./models/Topic');
const { advanceTopic } = require('./utils/scheduler');

async function seed() {
  await connectDB();

  await User.deleteMany({ email: 'demo@example.com' });
  const user = await User.create({
    name: 'Demo Student',
    email: 'demo@example.com',
    password: 'password123',
  });

  const subject = await Subject.create({
    user: user._id,
    name: 'Biology',
    description: 'Class 10 Biology',
  });

  const titles = [
    'Cell Structure',
    'Photosynthesis',
    'Human Digestive System',
    'Genetics Basics',
    'Respiration',
  ];

  for (const title of titles) {
    const topic = await Topic.create({
      user: user._id,
      subject: subject._id,
      title,
    });

    // simulate one revision cycle so dashboard has data immediately
    const update = advanceTopic(topic.status);
    Object.assign(topic, update);
    await topic.save();
  }

  console.log('Seed complete. Login with demo@example.com / password123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
