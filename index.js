require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Route and game logic
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const { initGameEngine } = require('./services/gameEngine');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend from public folder
const path = require('path');

// Serve frontend from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// API routes
app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

// WebSocket logic
initGameEngine(io);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.send('Welcome to Crypto Crash!');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
