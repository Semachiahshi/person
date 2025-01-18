const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Načítání proměnných z .env souboru
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const DB_URI = process.env.MONGO_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Define User model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  verified: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = new User({ email, password });
    await user.save();

    const verifyLink = `http://localhost:3000/verify/${user._id}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your account',
      text: `Click this link to verify your account: ${verifyLink}`,
    });

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.get('/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { verified: true });
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.send('Account verified!');
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).send('Verification failed.');
  }
});

// Socket.IO
const users = {};
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (data) => {
    users[socket.id] = data.username;
    io.emit('users', Object.values(users));
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('users', Object.values(users));
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
