require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const logger = require('./helpers/logger');

const server = http.createServer(app);

const redis = require('./helpers/redis');
const { adaptor, io } = redis(server);

io.adapter(adaptor);
io.listen(3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(logger);

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
