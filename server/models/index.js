const sequelize = require('../config/database');
const User = require('./User');
const Exam = require('./Exam');
const CBT = require('./CBT');
const MockTest = require('./MockTest');
const Question = require('./Question');
const TestAttempt = require('./TestAttempt');
const UserAnswer = require('./UserAnswer');
const Payment = require('./Payment');
const Feedback = require('./Feedback');

// ── Associations ──

// Exam → CBTs
Exam.hasMany(CBT, { foreignKey: 'examId', as: 'cbts' });
CBT.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

// CBT → MockTests
CBT.hasMany(MockTest, { foreignKey: 'cbtId', as: 'mockTests' });
MockTest.belongsTo(CBT, { foreignKey: 'cbtId', as: 'cbt' });

// MockTest → Questions
MockTest.hasMany(Question, { foreignKey: 'mockTestId', as: 'questions' });
Question.belongsTo(MockTest, { foreignKey: 'mockTestId', as: 'mockTest' });

// User → TestAttempts
User.hasMany(TestAttempt, { foreignKey: 'userId', as: 'attempts' });
TestAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// MockTest → TestAttempts
MockTest.hasMany(TestAttempt, { foreignKey: 'mockTestId', as: 'attempts' });
TestAttempt.belongsTo(MockTest, { foreignKey: 'mockTestId', as: 'mockTest' });

// TestAttempt → UserAnswers
TestAttempt.hasMany(UserAnswer, { foreignKey: 'attemptId', as: 'answers' });
UserAnswer.belongsTo(TestAttempt, { foreignKey: 'attemptId', as: 'attempt' });

// Question → UserAnswers
Question.hasMany(UserAnswer, { foreignKey: 'questionId', as: 'userAnswers' });
UserAnswer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// User → Payments
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// MockTest → Payments
MockTest.hasMany(Payment, { foreignKey: 'mockTestId', as: 'payments' });
Payment.belongsTo(MockTest, { foreignKey: 'mockTestId', as: 'mockTest' });

// User → Feedback
User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Exam,
  CBT,
  MockTest,
  Question,
  TestAttempt,
  UserAnswer,
  Payment,
  Feedback,
};
