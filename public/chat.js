// SETUP ======================================================================

// Open connection to server with / namespace
const socket = io('http://localhost:3000');

// Global variable
let username = '';

// Listen for a connect and gather username
socket.on('connect', () => {
    username = prompt('Username');
    if (!username) username = `Connection#${socket.id}`;
});

// Set DOM nodes
const messageField = document.getElementById('message-field');
const chatLog = document.getElementById('chat-log');

// Trigger for typing feedback
let isTyping = false;

// ============================================================================


// DOM EVENT HANDLERS =========================================================

messageField.addEventListener('keypress', (ev) => {
    let key = ev.which || ev.keyCode;
    if (key == 13) { // 'Enter' key
        message = {
            username: username,
            message: messageField.value
        };
        isTyping = false;
        socket.emit('chat', message);
        postChatMessage(message);
        clearMessageField();
    }
});

messageField.addEventListener('input', (ev) => {
    if (messageField.value === '') {
        let notTyping = { username: username };
        isTyping = false;
        socket.emit('not typing', notTyping);
    } else {
        if (!isTyping) {
            let typing = { username: username };
            isTyping = true;
            socket.emit('is typing', typing);
        }
    }
});

// ============================================================================


// SOCKET EVENT HANDLERS ======================================================

socket.on('chat', (message) => {
    removeFeedback(message.socketId);
    postChatMessage(message);
});

socket.on('is typing', (typing) => {
    feedbackIsPosting(typing);
});

socket.on('not typing', (notTyping) => {
    removeFeedback(notTyping.socketId);
});

// ============================================================================


// AUXILIARY FUNCTIONS ========================================================

function postChatMessage(message) {
    // Create a new post element
    let post = document.createElement('div');
    post.classList = 'post chat-log-entry';

    // Create the post children to the post element
    let postUsername = document.createElement('p');
    postUsername.classList = 'post-username';
    postUsername.innerHTML = message.username;
    post.appendChild(postUsername);

    let postMessage = document.createElement('p');
    postMessage.classList = 'post-message';
    postMessage.innerHTML = message.message;
    post.appendChild(postMessage);

    // Get the latest .post from the chatlog entries
    const postList = document.querySelectorAll('.post');
    const latestPost = postList[postList.length - 1];

    // If there are no entries in the chatlog latestPost is undefined, just append
    if (! latestPost) {
        chatLog.appendChild(post);
    } else {
        /* Append the new post after the latestPost (by appending it before the
        latestPost's next sibling, which is an entry not of type post, like
        .feedback for instance) */
        chatLog.insertBefore(post, latestPost.nextSibling);
    }
    
    // Autoscroll down after new content
    chatLog.scrollTop = chatLog.scrollHeight;
}

function clearMessageField() {
    messageField.value = '';
}

function feedbackIsPosting(typing) {
    let feedback = document.createElement('div');
    feedback.classList = 'feedback chat-log-entry';
    feedback.id = `typing-feedback-${typing.socketId}`;

    // Create the feedback text
    let feedbackText = document.createElement('p');
    feedbackText.classList = 'feedback-text';
    feedbackText.innerHTML = `<em>${typing.username}</em> is typing...`;
    feedback.appendChild(feedbackText);

    chatLog.appendChild(feedback);

    // Autoscroll down after new content
    chatLog.scrollTop = chatLog.scrollHeight;
}

function removeFeedback(socketId) {
    let feedback = document.querySelector(`#typing-feedback-${socketId}`);
    feedback.remove();
}

// ============================================================================