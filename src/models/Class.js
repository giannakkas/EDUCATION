const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a class name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  code: {
    type: String,
    unique: true,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for lessons
classSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'class',
  justOne: false
});

// Generate unique class code
classSchema.pre('save', async function(next) {
  if (!this.code) {
    this.code = await generateUniqueCode();
  }
  next();
});

async function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const existingClass = await mongoose.model('Class').findOne({ code });
    if (!existingClass) {
      isUnique = true;
    }
  }
  
  return code;
}

module.exports = mongoose.model('Class', classSchema);
