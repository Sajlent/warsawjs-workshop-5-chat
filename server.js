const io = require('socket.io');
const server = io();

server.on('connection', (client) => {
    console.log(`Client with ID: ${client.id} connected!`);
    client.on('message', (msg) => {
       console.log(msg);
       client.broadcast.emit('message', msg);
    });
});
server.listen(3000);