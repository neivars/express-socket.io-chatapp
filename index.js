const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {wsEngine: 'ws'});

http.listen(3000, () => console.log('connected to port 3000') );

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.sendFile(`index.html`);
});

io.on('connection', chatListeners);

function chatListeners(socket) {
    console.log(`New connection ${socket.id}`);

    // Respond to incoming chat message
    socket.on('chat', (message) => {
        console.log(message);
        socket.broadcast.emit('chat', {
            username: message.username,
            message: message.message
        });
    });
}