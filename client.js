const io = require('socket.io-client');
const socket = io(`http://${process.argv[2] || 'localhost'}:3000`);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
let LOGGED_USER = '';

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

function handleRegisterResp(registerSuccess) {
    clearPrompt();
    if (registerSuccess) {
        console.log('>> REGISTRATION SUCCESFUL!');
    } else {
        console.log('>> REGISTRATION FAILED!');
    }
    readline.prompt();
}

function handleLoginResp(username) {
    clearPrompt();
    if (username) {
        LOGGED_USER = username;
        readline.setPrompt(`${username}: `);
    } else {
        console.log('>> LOGIN FAILED');
    }
    readline.prompt();
}

function handleIncomingMessage(msg) {
    clearPrompt();
    console.log(`>> ${msg}`);
    readline.prompt();
}

socket.on('register', handleRegisterResp);
socket.on('login', handleLoginResp);
socket.on('message', handleIncomingMessage);

readline.on('line', (line) => {
    const lineArgs = line.split(/\s+/);
    const firstWord = lineArgs[0];
    if (firstWord === '/exit') {
        readline.close();
        process.exit(0);
    } else if (firstWord === '/register') {
        if (lineArgs.length >= 3) {
            socket.emit('register', {
                username: lineArgs[1],
                password: lineArgs[2]
            });
        }
    } else if (firstWord === '/login') {
        if (lineArgs.length >= 3) {
            socket.emit('login', {
                username: lineArgs[1],
                password: lineArgs[2]
            });
        }
    } else if (firstWord === '/logout') {
        socket.emit('logout', LOGGED_USER);
        LOGGED_USER = '';
        readline.setPrompt('> ');
    } else if (line.trim()) {
        socket.emit('message', line);
    }
    readline.prompt();
});

//on startup
console.log('Client started!');
readline.prompt();