document.getElementById('signupform')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !phone || !password) {
        alert('All fields are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/signup', { name, email, phone, password });

        if (response.data.success) {
            alert('Signup Successful');
            window.location.href = 'login.html';
        } else {
            alert(response.data.message);
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
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('username', response.data.user.name); 
            alert('User Login Successfully');
            window.location.href = 'dashboard.html';
        } else {
            alert(response.data.message);
        }
    } catch (err) {
        console.log('Error in Login', err);
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
// Initialize user groups and messages
document.addEventListener('DOMContentLoaded', () => {
    fetchGroups();
});

// Fetch Groups 
async function fetchGroups() {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.get('http://localhost:3000/api/groups', {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const groups = response.data.groups;
        const groupList = document.getElementById('groupList');
        groupList.innerHTML = '';  

        if (groups && groups.length > 0) {
            groups.forEach((group) => {
                const groupElement = document.createElement('li');
                groupElement.innerHTML = `<button onclick="switchGroup('${group.groupname}')">${group.groupname}</button>`;
                groupList.appendChild(groupElement);
            });

            // check if the user is part of any group
            const currentGroup = localStorage.getItem('currentGroup');
            if (currentGroup && groups.some(group => group.groupname === currentGroup)) {
                document.getElementById('currentGroupDisplay').textContent = `Current Group: ${currentGroup}`;
                fetchMessages(currentGroup);
            }
        } else {
            groupList.innerHTML = '<li>No groups found</li>';
        }
    } catch (error) {
        console.error('Error fetching groups:', error);
       
    }
}

// it will switch to  specific group
async function switchGroup(groupName) {
    localStorage.setItem('currentGroup', groupName);
    document.getElementById('currentGroupDisplay').textContent = `Current Group: ${groupName}`;
    fetchMessages(groupName);
}

// Create a new group
async function createGroup() {
    const groupName = document.getElementById('group').value;
    const token = localStorage.getItem('authToken');

    if (!groupName) {
        alert('Group name is required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/groups', { groupname: groupName }, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.data.success) {
            alert('Group created successfully');
            fetchGroups(); 
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error creating group:', error);
        alert('Failed to create group');
    }
}

// it will invite a user to  group
async function invite() {
    const email = prompt('Enter the email of the user you want to invite:');
    const groupName = localStorage.getItem('currentGroup');
    const token = localStorage.getItem('authToken');

    if (!email || !groupName || !token) {
        alert('Email, group name, and token are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/groups/invite', { email, groupName }, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.data.success) {
            alert('User  invited successfully');
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error inviting user:', error);
        alert('Failed to invite user');
    }
}

// fetch Messages for the current group
async function fetchMessages(groupName = null) {
    if (!groupName) {
        groupName = localStorage.getItem('currentGroup');
    }
    const token = localStorage.getItem('authToken');

    if (!groupName) {
        alert('No group selected');
        return;
    }

    try {
        const response = await axios.get(`http://localhost:3000/api/messages/${groupName}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const messages = response.data.messages;
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = ''; 

        messages.forEach((msg) => {
            const userName = msg.user ? msg.user.name : 'Unknown User'; 
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<strong>${userName}:</strong> ${msg.message}`;
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
    }

    // setInterval(() => fetchMessages(groupName), 1000);  
}

document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.fileUrl) {
         console.log('File uploaded successfully:', data.fileUrl);
          fileInput.value = '';
        }
        else {
            console.error('Error uploading file:', data.message);
        }
    }).catch(error => {
        console.error('Error uploading file:', error);
    });
});


const socket = io('http://localhost:3000');
// it will istens for new messages
socket.on('newMessage', (data) => {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${data.name}:</strong> ${data.message}`;
    messagesContainer.appendChild(messageElement);
});
document.getElementById('sendMessage').addEventListener('click', async () => {
    const message = document.getElementById('message').value;
    const groupName = localStorage.getItem('currentGroup');
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');

    if (!message || !groupName || !token) {
        alert('Message, group name, and token are required');
        return;
    }

 try {
        console.log('Sending message:', message);
        const response = await axios.post(`http://localhost:3000/api/messages/${groupName}`, { message, name: username }, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        console.log('Message sent:', response.data);
        socket.emit('sendMessage', { name: username, message: response.data.data.message });

        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${username}:</strong> ${response.data.data.message}`;
        document.getElementById('messages').appendChild(messageElement);

        document.getElementById('message').value = '';  
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message');
    }
});

// make a user an admin
document.getElementById('makeAdmin').addEventListener('click', async () => {
    const userEmail = document.getElementById('userEmail').value;
    const token = localStorage.getItem('authToken');

    if (!userEmail || !token) {
        alert('User email and token are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/groups/makeAdmin', { userEmail }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
            alert('User is now an admin');
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error making user admin:', error);
    }
});

document.getElementById('removeUser').addEventListener('click', async () => {
    const userEmail = document.getElementById('userEmail').value;
    const token = localStorage.getItem('authToken');

    if (!userEmail || !token) {
        alert('User email and token are required');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/groups/removeUser', { userEmail }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
            alert('User removed from the group');
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error removing user:', error);
    }
});