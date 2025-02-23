const { createServer } = require('http');
const express = require('express');
const WebSocket = require('ws');
const app = express();
app.use(express.json({ extended: false }));
app.use(express.static('public'));

var port = 3000;

const PRIMARY_REGION = process.env.PRIMARY_REGION;
const CURRENT_REGION = process.env.FLY_REGION;

const server = new WebSocket.Server({
  server: app.listen(port, '0.0.0.0', () => {
    console.log(`Server running in region ${CURRENT_REGION} at http://0.0.0.0:${port}`);
  })
});

server.on('connection', (socket, req) => {
  // Check if we're in the primary region
  if (PRIMARY_REGION && CURRENT_REGION !== PRIMARY_REGION) {
    // Not in primary region, close connection with replay header
    const headers = {
      'fly-replay': `region=${PRIMARY_REGION}`
    };
    socket.close(1011, JSON.stringify(headers));
    return;
  }

  // Handle connection normally if in primary region
  socket.on('message', (msg) => {
    server.clients.forEach(client => {
      client.send(msg);
    });
  });
});