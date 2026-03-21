const { Feedback } = require('../models');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
require('dotenv').config();

// POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const feedback = await Feedback.create({
      userId: req.user ? req.user.id : null,
      name,
      email,
      message,
    });

    // Send notification email
    try {
      await transporter.sendMail({
        from: `"MockTest Feedback" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Feedback from ${name}`,
        html: `
          <h3>New Feedback Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        `,
});
    } catch (emailErr) {
      console.log('Feedback email notification failed:', emailErr.message);
    }

    res.json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
