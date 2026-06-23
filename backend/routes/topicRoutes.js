const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  createTopic,
  getTopicsBySubject,
  updateTopic,
  deleteTopic,
  markRevised,
  getWeakTopics,
} = require('../controllers/topicController');

router.use(protect);

router.post('/', createTopic);
router.get('/weak', getWeakTopics);
router.get('/subject/:subjectId', getTopicsBySubject);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);
router.patch('/:id/revise', markRevised);

module.exports = router;
