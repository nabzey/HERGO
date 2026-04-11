const express = require('express');
const {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} = require('../controllers/calendar.controller');
const { authMiddleware, hostMiddleware } = require('../core/middlewares/auth.middleware');
const { validate } = require('../helpers/validation');

const router = express.Router();

router.get('/', authMiddleware, hostMiddleware, getCalendarEvents);
router.post('/', authMiddleware, hostMiddleware, validate('createCalendarEvent'), createCalendarEvent);
router.put('/:id', authMiddleware, hostMiddleware, validate('createCalendarEvent'), updateCalendarEvent);
router.delete('/:id', authMiddleware, hostMiddleware, deleteCalendarEvent);

module.exports = router;