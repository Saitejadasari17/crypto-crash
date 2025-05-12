require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const { initGameEngine } = require('./services/gameEngine');

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

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

// WebSocket connection for game
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Emit multiplier value when the user connects
  socket.emit('message', JSON.stringify({ type: 'multiplier', value: 1.00 }));

  socket.on('message', (msg) => {
    const data = JSON.parse(msg);

    // Handle bet placement
    if (data.type === 'bet') {
      console.log(`Bet placed: ${data.amount}`);
      // Place bet logic
    }

    // Handle cashout request
    if (data.type === 'cashout') {
      console.log('Cash out requested');
      // Handle cashout logic
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Initialize game engine if needed
initGameEngine(io);
