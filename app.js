const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const winston = require('winston');
const expressWinston = require('express-winston');

const server = http.createServer(app);

require('dotenv').config();

const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const { Server } = require('socket.io');
const io = new Server(server);

const pubClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
const subClient = pubClient.duplicate();

const logger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
});

io.adapter(createAdapter(pubClient, subClient));
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

server.listen(process.env.PORT || 5000, () => {
  console.log('listening on *:3000');
});
