exports.initGameEngine = (io) => {
  console.log("Game engine initialized");
  io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('multiplier', { multiplier: 1.5 });
  });
};