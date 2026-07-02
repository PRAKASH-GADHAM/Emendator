const express = require('express');
const { param } = require('express-validator');
const historyController = require('../controllers/history.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', historyController.getHistory);
router.delete('/:id', [param('id').notEmpty().withMessage('Review ID required'), validate], historyController.deleteReview);

module.exports = router;