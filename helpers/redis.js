const redis = (server) => {
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

  return {
    io,
    adaptor: createAdapter(pubClient, subClient),
  };
};


module.exports = redis;