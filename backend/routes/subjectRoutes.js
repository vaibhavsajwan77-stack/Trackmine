const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');

router.use(protect);

router.post('/', createSubject);
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
