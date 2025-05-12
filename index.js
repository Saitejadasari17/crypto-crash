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

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://saitejadasari:Engineer17@cluster0.dpk9pda.mongodb.net/CryptoCrash?retryWrites=true&w=majority')

  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

initGameEngine(io);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
