const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests

// Razorpay instance initialization with hardcoded keys
const razorpay = new Razorpay({
  key_id: 'rzp_test_o8Jt6TYig30XtL', // Your Razorpay key_id
  key_secret: 'oNUtvG0gHnYOfTpydhMFsurJ', // Your Razorpay key_secret
});

// Create a payment order
app.get('/pay', async (req, res) => {
  try {
    const amount = req.query.amount * 100; // Amount in paise (e.g., 100 rupees = 10000 paise)

    const options = {
      amount: amount, // Amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Math.random() * 1000}`,
      payment_capture: 1, // Capture payment immediately
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      orderId: order.id,
      key_id: 'rzp_test_o8Jt6TYig30XtL', // Send key_id to frontend
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error in creating Razorpay order:', error);
    res.status(500).json({ error: 'Error in creating Razorpay order' });
  }
});

// Start server on port 5000
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
