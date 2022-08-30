const PORT = 81;
const WebSocket = require('ws'),
  server = new WebSocket.Server({
    port: PORT,
  });
function broadcast(data) {
  server.clients.forEach((ws) => {
    ws.send(data);
  });
}
server.on('connection', (ws) => {
  console.log('Server is listening to port: ', PORT);
  ws.on('message', (data) => {
    broadcast(data);
  });
});
