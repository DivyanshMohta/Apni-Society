// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcryptjs'); // For hashing passwords
// const jwt = require('jsonwebtoken'); // For generating tokens

// const app = express();
// const port = 5000;

// // MongoDB URI (Update this with your actual MongoDB connection string)
// const mongoURI = 'mongodb://localhost:27017/ApniSociety'; 

// // Connect to MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Define a User schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// // Create a User model
// const User = mongoose.model('User', userSchema);

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // POST route for login
// app.post('/', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("not user");
//       return res.status(400).json({ message: 'User not found' });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate token (if needed for your application)
//     const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
//     console.log("success");
//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     console.log("not success");
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // For generating tokens

const app = express();
const port = 5000;

// MongoDB URI (Update this with your actual MongoDB connection string)
const mongoURI = 'mongodb://localhost:27017/ApniSociety'; 

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Create a User model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route for login
app.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("not user");
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password (no encryption)
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token (if needed for your application)
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    console.log("success");
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.log("not success");
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
