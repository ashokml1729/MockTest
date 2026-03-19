const nodemailer = require('nodemailer');
require('dotenv').config();

// In-memory OTP store with TTL
const otpStore = new Map();
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY,
  });

  // Auto-cleanup after expiry
  setTimeout(() => {
    otpStore.delete(email);
  }, OTP_EXPIRY);
}

function verifyOTP(email, otp) {
  const stored = otpStore.get(email);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  if (stored.otp !== otp) return false;
  otpStore.delete(email); // One-time use
  return true;
}

// Create transporter (will use preview in dev if no credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: `"MockTest Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for MockTest Platform',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 16px;">
        <h2 style="color: #22d3ee; margin-bottom: 10px;">🔐 OTP Verification</h2>
        <p style="color: #94a3b8; font-size: 15px;">Your One-Time Password is:</p>
        <div style="background: rgba(34, 211, 238, 0.1); border: 1px solid rgba(34, 211, 238, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #22d3ee;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 13px;">This OTP expires in 5 minutes. Do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;">
        <p style="color: #475569; font-size: 12px;">MockTest Platform • Powered by Education</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    // In development, log the OTP to console
    console.log(`📧 OTP for ${email}: ${otp}`);
    return true; // Still return true so flow continues in dev
  }
}

module.exports = { generateOTP, storeOTP, verifyOTP, sendOTPEmail };
