const Lesson = require('../models/Lesson');
const claudeService = require('../services/claudeService');
const creditService = require('../services/creditService');

// @desc    Generate new lesson
// @route   POST /api/lessons/generate
// @access  Private
exports.generateLesson = async (req, res, next) => {
  try {
    const { prompt, subject, grade, difficulty } = req.body;

    // Check if user has enough credits
    const hasCredits = await creditService.checkCredits(req.user.id, 1);
    if (!hasCredits) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient credits. Please purchase more credits to generate lessons.'
      });
    }

    // Generate lesson using Claude
    const lessonData = await claudeService.generateLesson(
      prompt,
      subject,
      grade,
      difficulty
    );

    // Generate exercises
    const exercises = await claudeService.generateExercises(
      lessonData.content,
      subject,
      grade
    );

    // Create lesson in database
    const lesson = await Lesson.create({
      title: lessonData.title,
      description: lessonData.description,
      content: lessonData.content,
      subject,
      grade,
      difficulty,
      exercises,
      duration: lessonData.duration,
      createdBy: req.user.id
    });

    // Deduct credits
    await creditService.deductCredits(req.user.id, 1, 'lesson_generation', lesson._id);

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Private
exports.getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ createdBy: req.user.id })
      .sort('-createdAt')
      .select('-exercises');

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Make sure user owns lesson
    if (lesson.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this lesson'
      });
    }

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Make sure user owns lesson
    if (lesson.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this lesson'
      });
    }

    // Update lesson
    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Make sure user owns lesson
    if (lesson.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this lesson'
      });
    }

    await lesson.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 