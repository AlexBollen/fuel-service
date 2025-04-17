const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Connected client');
  
  ws.on('message', (message) => {
    console.log(`Receibed message: ${message}`);
  });

  ws.send('Hello from server');
});

console.log('WebSocket server running on port 8080');
