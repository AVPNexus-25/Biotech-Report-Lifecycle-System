const express = require('express');
const { createUser, getUsers } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', auth, role('admin'), createUser);
router.get('/', auth, role('admin'), getUsers);

module.exports = router;