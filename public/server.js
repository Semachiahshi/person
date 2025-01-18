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

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/register', async (req, res) => {
  // (Zbytek vaší logiky zůstává stejný)
});

// Route pro obsluhu SPA (jednostránková aplikace)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Socket.IO
const users = {};
io.on('connection', (socket) => {
  // (Zbytek vaší logiky zůstává stejný)
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
