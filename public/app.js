{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Kontrola k\'f3du server.js a opravy\
\
const express = require('express');\
const mongoose = require('mongoose');\
const http = require('http');\
const \{ Server \} = require('socket.io');\
const nodemailer = require('nodemailer');\
const dotenv = require('dotenv');\
const cors = require('cors');\
\
dotenv.config(); // Na\uc0\u269 \'edt\'e1n\'ed prom\u283 nn\'fdch z .env souboru\
const app = express();\
const server = http.createServer(app);\
const io = new Server(server, \{ cors: \{ origin: "*" \} \});\
\
// Middleware\
app.use(express.json());\
app.use(cors());\
\
// MongoDB Connection\
const DB_URI = process.env.MONGO_URI;\
mongoose.connect(DB_URI, \{ useNewUrlParser: true, useUnifiedTopology: true \})\
  .then(() => console.log('Database connected'))\
  .catch(err => console.error('Database connection error:', err));\
\
// User model\
const UserSchema = new mongoose.Schema(\{\
  email: \{ type: String, required: true \},\
  password: \{ type: String, required: true \},\
  verified: \{ type: Boolean, default: false \},\
\});\
const User = mongoose.model('User', UserSchema);\
\
// Nodemailer setup\
const transporter = nodemailer.createTransport(\{\
  service: 'gmail',\
  auth: \{\
    user: process.env.EMAIL_USER,\
    pass: process.env.EMAIL_PASS,\
  \},\
\});\
\
// API Routes\
app.post('/register', async (req, res) => \{\
  try \{\
    const \{ email, password \} = req.body;\
    if (!email || !password) \{\
      return res.status(400).json(\{ message: 'Email and password are required.' \});\
    \}\
    const user = new User(\{ email, password \});\
    await user.save();\
\
    const verifyLink = `http://localhost:3000/verify/$\{user._id\}`;\
    await transporter.sendMail(\{\
      from: process.env.EMAIL_USER,\
      to: email,\
      subject: 'Verify your account',\
      text: `Click this link to verify your account: $\{verifyLink\}`,\
    \});\
\
    res.json(\{ message: 'Verification email sent' \});\
  \} catch (error) \{\
    console.error('Error during registration:', error);\
    res.status(500).json(\{ message: 'Registration failed' \});\
  \}\
\});\
\
app.get('/verify/:id', async (req, res) => \{\
  try \{\
    const \{ id \} = req.params;\
    const user = await User.findByIdAndUpdate(id, \{ verified: true \});\
    if (!user) \{\
      return res.status(404).send('User not found.');\
    \}\
    res.send('Account verified!');\
  \} catch (error) \{\
    console.error('Error during verification:', error);\
    res.status(500).send('Verification failed.');\
  \}\
\});\
\
// Socket.IO for Real-Time Chat\
const users = \{\};\
\
io.on('connection', (socket) => \{\
  console.log('A user connected:', socket.id);\
\
  socket.on('join', (data) => \{\
    users[socket.id] = data.username;\
    io.emit('users', Object.values(users));\
  \});\
\
  socket.on('message', (data) => \{\
    io.emit('message', data);\
  \});\
\
  socket.on('disconnect', () => \{\
    delete users[socket.id];\
    io.emit('users', Object.values(users));\
  \});\
\});\
\
// Start server\
const PORT = process.env.PORT || 3000;\
server.listen(PORT, () => console.log(`Server running on port $\{PORT\}`));\
}