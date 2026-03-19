const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Payment, MockTest } = require('../models');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { mockTestId } = req.body;
    const test = await MockTest.findByPk(mockTestId);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    if (test.isFree) return res.status(400).json({ error: 'This test is free' });

    // Check if already paid
    const existingPayment = await Payment.findOne({
      where: { userId: req.user.id, mockTestId, status: 'paid' },
    });
    if (existingPayment) return res.status(400).json({ error: 'Already purchased' });

    const options = {
      amount: 1000, // ₹10 in paise
      currency: 'INR',
      receipt: `order_${req.user.id}_${mockTestId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.user.id,
      mockTestId,
      razorpayOrderId: order.id,
      amount: 10,
      status: 'created',
    });

    res.json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

// POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const payment = await Payment.findOne({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) return res.status(404).json({ error: 'Payment record not found' });

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.status = 'paid';
    await payment.save();

    res.json({ message: 'Payment verified successfully', testUnlocked: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
