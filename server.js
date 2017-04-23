const io = require('socket.io');
const server = io();

const USERS = {};

function handleMessage(client) {
    return (msg) => {
        console.log(msg);
        client.broadcast.emit('message', msg);
    }
}

function registerUser(client) {
    return (userObject) => {
        if (USERS[userObject.username]) {
            client.emit('register', false);
        } else {
            USERS[userObject.username] = {
                password: userObject.password,
                logged_in: false
            };
            client.emit('register', true);
        }
    }
}

function loginUser(client) {
    return (userObject) => {
        const user = USERS[userObject.username];
        console.log(user);
        if (user.password === userObject.password) {
            user.logged_in = true;
            client.emit('login', userObject.username);
        } else {
            client.emit('login', false);
        }
    }
}

function logoutUser(username) {
    USERS[username].logged_in = false;
}

server.on('connection', (client) => {
    console.log(`Client with ID: ${client.id} connected!`);
    client.on('message', handleMessage(client));
    client.on('register', registerUser(client));
    client.on('login', loginUser(client));
    client.on('logout', logoutUser);
});

//on startup
console.log('Server started!');
server.listen(3000);