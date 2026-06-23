const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getToday, getStats } = require('../controllers/dashboardController');

router.use(protect);

router.get('/today', getToday);
router.get('/stats', getStats);

module.exports = router;
