const io = require('socket.io');
const server = io();

const USERS = {};

server.on('connection', (client) => {
    console.log(`Client with ID: ${client.id} connected!`);
    client.on('message', (msg) => {
       console.log(msg);
       client.broadcast.emit('message', msg);
    });
    client.on('register', (userObject) => {
        USERS[userObject.username] = {
            password: userObject.password,
            logged_in: false
        };
    });
    client.on('login', (userObject) => {
        const user = USERS[userObject.username];
        console.log(user);
        if (user.password === userObject.password) {
            user.logged_in = true;
            client.emit('login', userObject.username);
        } else {
            client.emit('login', false);
        }
    });
});

//on startup
console.log('Server started!');
server.listen(3000);