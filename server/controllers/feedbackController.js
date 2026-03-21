const { Feedback } = require('../models');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
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
      await resend.emails.send({
        from: 'onboarding@resend.dev',  // use this until you verify your domain
        to: process.env.EMAIL_USER,     // your gmail — admin notification
        subject: 'New Feedback Received - MockTest',
        html: `
          <h2>New Feedback</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b> ${message}</p>
        `
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
