{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 document.addEventListener('DOMContentLoaded', () => \{\
  const socket = io();\
\
  const registerForm = document.getElementById('register-form');\
  const emailInput = document.getElementById('email');\
  const passwordInput = document.getElementById('password');\
  const chatSection = document.getElementById('chat-section');\
  const messagesDiv = document.getElementById('messages');\
  const messageInput = document.getElementById('message');\
  const sendButton = document.getElementById('send-btn');\
\
  registerForm.addEventListener('submit', async (e) => \{\
    e.preventDefault();\
    const email = emailInput.value;\
    const password = passwordInput.value;\
\
    const response = await fetch('http://localhost:3000/register', \{\
      method: 'POST',\
      headers: \{ 'Content-Type': 'application/json' \},\
      body: JSON.stringify(\{ email, password \}),\
    \});\
\
    const result = await response.json();\
    alert(result.message);\
  \});\
\
  sendButton.addEventListener('click', () => \{\
    const message = messageInput.value;\
    socket.emit('message', \{ message \});\
    messageInput.value = '';\
  \});\
\
  socket.on('message', (data) => \{\
    const p = document.createElement('p');\
    p.textContent = data.message;\
    messagesDiv.appendChild(p);\
    messagesDiv.scrollTop = messagesDiv.scrollHeight;\
  \});\
\});}