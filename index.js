// REQUIRES ===================================================================

const express = require('express'); // Minimalist node.js server framework
const app = express(); // Express' http eventhandling object
const http = require('http').createServer(app); /* Node.js http server with
    express http eventhandling */
const io = require('socket.io')(http, {wsEngine: 'ws'}); // Websocket lib

// ============================================================================


// APP SETUP ==================================================================

// Start listening to port 3000
http.listen(3000, () => console.log('connected to port 3000') );

// Use express' static file middleware
app.use(express.static('./public'));

// ============================================================================


// ROUTES =====================================================================

app.get('/', (req, res) => {
    res.sendFile(`index.html`);
});

// ============================================================================


// SOCKET EVENT HANDLERS ======================================================

// Assign the chatListeners eventhandling function when a socket connects
io.on('connection', chatListeners);

// Event handlers for sockets sending data to the server
function chatListeners(socket) {
    console.log(`New connection ${socket.id}`);

    // User sent chat message up the pipe
    socket.on('chat', (message) => {
        console.log(message);
        socket.broadcast.emit('chat', message);
    });

    // User is typing keys, triggering event up the pipe
    socket.on('is typing', (typing) => {
        socket.broadcast.emit('is typing', typing);
    });
}

// ============================================================================