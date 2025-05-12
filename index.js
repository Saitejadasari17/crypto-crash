require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const { initGameEngine } = require('./services/gameEngine');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  // These are now deprecated, but included for compatibility
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.send('Welcome to Crypto Crash!');
});

// Start the game engine
initGameEngine(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
