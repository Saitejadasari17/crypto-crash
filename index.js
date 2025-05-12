require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Game variables
let activeBets = [];
let currentMultiplier = 1;
let gameInterval;

// Start the game
function startGame() {
  currentMultiplier = 1;
  activeBets = [];
  gameInterval = setInterval(() => {
    currentMultiplier += 0.01;  // Increase multiplier every 100ms
    io.emit('message', JSON.stringify({ type: 'multiplier', value: currentMultiplier }));

    // End the game if multiplier reaches 10 (for example)
    if (currentMultiplier >= 10) {
      clearInterval(gameInterval);
      io.emit('message', JSON.stringify({ type: 'result', message: 'Game Over! Multiplier reached 10x!' }));
    }
  }, 100);
}

// Handle incoming socket messages
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (msg) => {
    const data = JSON.parse(msg);

    if (data.type === 'bet') {
      // Register bet
      activeBets.push({ socketId: socket.id, betAmount: data.amount });
      socket.emit('message', JSON.stringify({ type: 'result', message: `You placed a bet of ${data.amount}` }));
    }

    if (data.type === 'cashout') {
      // Find the user's bet and calculate winnings
      const userBet = activeBets.find(bet => bet.socketId === socket.id);
      if (userBet) {
        const winnings = userBet.betAmount * currentMultiplier;
        socket.emit('message', JSON.stringify({ type: 'result', message: `You cashed out! You won ${winnings.toFixed(2)}!` }));
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Remove bet when user disconnects
    activeBets = activeBets.filter(bet => bet.socketId !== socket.id);
  });
});

// Start a new game when the server starts
startGame();

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
