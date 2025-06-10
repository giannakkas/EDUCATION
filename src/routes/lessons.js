const express = require('express');
const {
  generateLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck'); // Correct import

const router = express.Router();

// Protect all routes
router.use(protect);

// Teacher only routes
router.post('/generate', authorize('teacher'), generateLesson);
router.put('/:id', authorize('teacher'), updateLesson);
router.delete('/:id', authorize('teacher'), deleteLesson);

// Routes for both teachers and students
router.get('/', getLessons);
router.get('/:id', getLesson);

module.exports = router;