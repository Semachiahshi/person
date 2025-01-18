<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2575.3">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 12.0px 0.0px; font: 12.0px Times; -webkit-text-stroke: #000000}
    p.p2 {margin: 0.0px 0.0px 12.0px 0.0px; font: 12.0px Times; -webkit-text-stroke: #000000; min-height: 14.0px}
    span.s1 {font-kerning: none}
  </style>
</head>
<body>
<p class="p1"><span class="s1"><b>const express = require('express');</b></span></p>
<p class="p1"><span class="s1"><b>const mongoose = require('mongoose');</b></span></p>
<p class="p1"><span class="s1"><b>const http = require('http');</b></span></p>
<p class="p1"><span class="s1"><b>const { Server } = require('socket.io');</b></span></p>
<p class="p1"><span class="s1"><b>const nodemailer = require('nodemailer');</b></span></p>
<p class="p1"><span class="s1"><b>const dotenv = require('dotenv');</b></span></p>
<p class="p1"><span class="s1"><b>const cors = require('cors');</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>dotenv.config();</b></span></p>
<p class="p1"><span class="s1"><b>const app = express();</b></span></p>
<p class="p1"><span class="s1"><b>const server = http.createServer(app);</b></span></p>
<p class="p1"><span class="s1"><b>const io = new Server(server, { cors: { origin: "*" } });</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>// Middleware</b></span></p>
<p class="p1"><span class="s1"><b>app.use(express.json());</b></span></p>
<p class="p1"><span class="s1"><b>app.use(cors());</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>// MongoDB Connection</b></span></p>
<p class="p1"><span class="s1"><b>const DB_URI = process.env.MONGO_URI; // Přidej své MongoDB URI do .env</b></span></p>
<p class="p1"><span class="s1"><b>mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>.then(() =&gt; console.log('Database connected'))</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>.catch(err =&gt; console.error(err));</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>// User model</b></span></p>
<p class="p1"><span class="s1"><b>const UserSchema = new mongoose.Schema({</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>email: String,</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>password: String,</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>verified: { type: Boolean, default: false },</b></span></p>
<p class="p1"><span class="s1"><b>});</b></span></p>
<p class="p1"><span class="s1"><b>const User = mongoose.model('User', UserSchema);</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>// Nodemailer setup</b></span></p>
<p class="p1"><span class="s1"><b>const transporter = nodemailer.createTransport({</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>service: 'gmail',</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>auth: {</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>user: process.env.EMAIL_USER, // Gmail účet</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>pass: process.env.EMAIL_PASS, // Heslo aplikace</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>},</b></span></p>
<p class="p1"><span class="s1"><b>});</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>// API Routes</b></span></p>
<p class="p1"><span class="s1"><b>app.post('/register', async (req, res) =&gt; {</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>const { email, password } = req.body;</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>const user = new User({ email, password });</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>await user.save();</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>const verifyLink = `http://localhost:3000/verify/${user._id}`;</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>await transporter.sendMail({</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>from: process.env.EMAIL_USER,</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>to: email,</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>subject: 'Verify your account',</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>text: `Click this link to verify your account: ${verifyLink}`,</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>});</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>res.json({ message: 'Verification email sent' });</b></span></p>
<p class="p1"><span class="s1"><b>});</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>app.get('/verify/:id', async (req, res) =&gt; {</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>const { id } = req.params;</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>await User.findByIdAndUpdate(id, { verified: true });</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>res.send('Account verified!');</b></span></p>
<p class="p1"><span class="s1"><b>});</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>// Socket.IO for Real-Time Chat</b></span></p>
<p class="p1"><span class="s1"><b>const users = {};</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>io.on('connection', (socket) =&gt; {</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>console.log('A user connected:', socket.id);</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>socket.on('join', (data) =&gt; {</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>users[socket.id] = data.username;</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>io.emit('users', Object.values(users));</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>});</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>socket.on('message', (data) =&gt; {</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>io.emit('message', data);</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>});</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>socket.on('disconnect', () =&gt; {</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>delete users[socket.id];</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">    </span>io.emit('users', Object.values(users));</b></span></p>
<p class="p1"><span class="s1"><b><span class="Apple-converted-space">  </span>});</b></span></p>
<p class="p1"><span class="s1"><b>});</b></span></p>
<p class="p2"><span class="s1"><b></b></span><br></p>
<p class="p1"><span class="s1"><b>// Start server</b></span></p>
<p class="p1"><span class="s1"><b>const PORT = process.env.PORT || 3000;</b></span></p>
<p class="p1"><span class="s1"><b>server.listen(PORT, () =&gt; console.log(`Server running on port ${PORT}`));</b></span></p>
</body>
</html>
