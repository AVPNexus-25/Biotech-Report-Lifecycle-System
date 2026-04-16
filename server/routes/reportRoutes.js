const express = require('express');
const {
  createReport,
  getReports,
  submitReport,
  approveReport,
  rejectReport
} = require('../controllers/reportController');

const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createReport);
router.get('/', auth, getReports);
router.post('/submit', auth, submitReport);
router.post('/approve', auth, approveReport);
router.post('/reject', auth, rejectReport);

module.exports = router;