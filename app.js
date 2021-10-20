const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('new-message', (message) => {
    console.log('New Message:', message);

    socket.broadcast.emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('listening on *:3000');
});
