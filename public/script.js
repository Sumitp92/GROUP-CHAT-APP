document.getElementById('signupform')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !phone || !password) {
        alert('All Field Are Require');
        return;
    }
    try {
        const response = await axios.post('http://localhost:3000/api/signup', { name, email, phone, password });

        if (response.data.success) {
            alert('Signup Succesfull');
            window.location.href = 'login.html';
        } else {
            response.data.message;
        }
    } catch (err) {
        console.log('Error During Signup', err);
        alert('Signup Failed');
    }
});

document.getElementById('loginform')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Email and password are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/login', { email, password });

        if (response.data.success) {
            sessionStorage.setItem('authToken', response.data.token);
            sessionStorage.setItem('username', response.data.user.name); // Store the username in sessionStorage
            alert("User Login Successfully");
            window.location.href = 'dashboard.html';
        } else {
            alert(response.data.message);
        }
    } catch (err) {
        console.log("Error in Login", err);
        alert('User Login Failed');
    }
});
// Switch to Signup page from Login page
document.getElementById('newUserBtn')?.addEventListener('click', () => {
    window.location.href = 'signup.html';
});

// Switch to Login page from Signup page
document.getElementById('loginBtn')?.addEventListener('click', () => {
    window.location.href = 'login.html';
});

// Fetch Chat Messages
async function fetchMessages() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.get('http://localhost:3000/api/messages', {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const messages = response.data.messages;
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';

        messages.forEach((msg) => {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<strong>${msg.name}:</strong> ${msg.message}`; 
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        // alert('Failed to fetch messages');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/dashboard.html') {
        fetchMessages();
        setInterval(fetchMessages, 1000);
    }
});

// Send Chat Message
document.getElementById('sendMessage')?.addEventListener('click', async () => {
    const message = document.getElementById('message').value;
    const token = sessionStorage.getItem('authToken'); //token from sessionStorage
    const username = sessionStorage.getItem('username'); 

    if (!message || !token) {
        alert('Message and token are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/messages', { message, name: username }, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${username}:</strong> ${response.data.data.message}`; 
        document.getElementById('messages').appendChild(messageElement);

        document.getElementById('message').value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message');
    }
});