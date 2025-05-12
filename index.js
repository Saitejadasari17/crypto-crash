// Importing required modules
require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// MongoDB connection using direct URI string
mongoose.connect('mongodb+srv://saitejadasari:Engineer17@cluster0.dpk9pda.mongodb.net/CryptoCrash?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Game data and WebSocket setup
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Send a welcome message when the client connects
  socket.send('Welcome to Crypto Crash!');

  // Handling bets and cash-out events
  socket.on('placeBet', (amount) => {
    console.log('Bet placed: ', amount);
    // Add your game logic for handling bets here
  });

  socket.on('cashOut', (amount) => {
    console.log('Cash out: ', amount);
    // Add your game logic for cashing out here
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server on a specified port
server.listen(process.env.PORT || 10000, () => {
  console.log(`Server is running on port ${process.env.PORT || 10000}`);
});
