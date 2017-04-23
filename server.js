const io = require('socket.io');
const server = io();

server.on('connection', (client) => {
    console.log(`Client with ID: ${client.id} connected!`);
    client.on('message', (msg) => {
       console.log(msg);
       client.broadcast.emit('message', msg);
    });
});

//on startup
console.log('Server started!');
server.listen(3000);