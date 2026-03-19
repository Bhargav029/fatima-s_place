const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();

// Allow connections from your React frontend and parse JSON bodies
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send("Fatima's Place Live Tracking & Payment Server is running!");
});


// RAZORPAY PAYMENT GATEWAY SETUP

// Replace these with your actual Test/Live keys from the Razorpay Dashboard
const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID', 
  key_secret: 'YOUR_RAZORPAY_SECRET'
});

// 1. Endpoint to create a Razorpay order
app.post('/create-razorpay-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Razorpay works in paise (multiply by 100)
      currency: "INR",
      receipt: `RCPT_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).send(error);
  }
});

// 2. Endpoint to verify the payment signature after user pays
app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  // Generate the signature we expect to see
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", 'YOUR_RAZORPAY_SECRET') // Must match the secret above!
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    return res.status(200).json({ message: "Payment verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid signature sent!" });
  }
});


// ==========================================
// SOCKET.IO REAL-TIME SETUP
// ==========================================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Store the latest driver location
let latestDriverLocation = [15.5470, 73.7635]; // Default starting coordinates

io.on('connection', (socket) => {
  console.log(`Device connected: ${socket.id}`);

  // Instantly send the last known location to whoever just connected
  socket.emit('locationUpdate', latestDriverLocation);

  // FEATURE 1: LIVE GPS TRACKING
  socket.on('driverLocationUpdate', (newLocation) => {
    latestDriverLocation = newLocation;
    // Broadcast to the Customer's Track Order page
    socket.broadcast.emit('locationUpdate', latestDriverLocation);
  });

  // FEATURE 2: KITCHEN & ADMIN ORDER SYNC
  socket.on('updateOrderStatus', (data) => {
    console.log(`Order ${data.orderId} status changed to: ${data.status}`);
    // Broadcast new status to Admin and Customer dashboards
    io.emit('orderStatusChanged', data);
  });

  // FEATURE 3: RECEIVE NEW CHECKOUT ORDERS
  socket.on('newOrder', (orderData) => {
    console.log(`New Order Received from Checkout:`, orderData.id);
    // Instantly send this new order to the Admin and Staff screens!
    io.emit('incomingNewOrder', orderData);
  });

  // Handle disconnections gracefully
  socket.on('disconnect', () => {
    console.log(`Device disconnected: ${socket.id}`);
  });
});

// Start the server on Port 4000
const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==============================================`);
  console.log(`Live Server running at: http://localhost:${PORT}`);
  console.log(`==============================================\n`);
});