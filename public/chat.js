const socket = io('http://localhost:3000');

// Set variables
const username = prompt('Username');
const messageField = document.getElementById('message-field');
const chatLog = document.getElementById('chat-log');

messageField.addEventListener('keypress', (ev) => {
    let key = ev.which || ev.keyCode;
    if (key == 13) {
        message = {
            username: username,
            message: messageField.value
        };
        socket.emit('chat', message);
        postChatMessage(message);
        clearMessageField();
    }
});

// Socket events
socket.on('chat', (message) => {
    postChatMessage(message);
});

function postChatMessage(message) {
    // Create a new post element
    let post = document.createElement('div');
    post.classList = 'post';

    // Create the post children to the post element
    let postUsername = document.createElement('p');
    postUsername.classList = 'post-username';
    postUsername.innerHTML = message.username;
    post.appendChild(postUsername);

    let postMessage = document.createElement('p');
    postMessage.classList = 'post-message';
    postMessage.innerHTML = message.message;
    post.appendChild(postMessage);

    chatLog.appendChild(post);
}

function clearMessageField() {
    messageField.value = '';
}