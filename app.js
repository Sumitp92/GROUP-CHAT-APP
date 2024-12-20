const Sequelize = require('sequelize');
const express = require('express');
const fileUpload = require('express-fileupload');
const http = require('http'); 
const sequelize = require('./util/databases');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const server = http.createServer(app);
const socketIo = require('socket.io'); 
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require('./model/userdetail');
const Message = require('./model/messages');
const Group = require('./model/group');
const GroupMembers = require('./model/group');

User .hasMany(Group, { foreignKey: 'userId' });
Group.belongsTo(User, { foreignKey: 'userId' });

User .hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Group.hasMany(Message, { foreignKey: 'groupId' });
Message.belongsTo(Group, { foreignKey: 'groupId' });

Group.belongsToMany(User, { through: GroupMembers, foreignKey: 'groupId' });
User .belongsToMany(Group, { through: GroupMembers, foreignKey: 'userId' });

const GeneralRoutes = require('./routes/user');
const MessageRoutes = require('./routes/message');
const GroupRoutes = require('./routes/group');
const fileRoutes = require('./routes/upload');

app.use('/api', GeneralRoutes);
app.use('/api', MessageRoutes);
app.use('/api', GroupRoutes);
app.use(fileUpload());
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


io.on('connection', (socket) => {
    console.log('user connected');
    
    socket.on('sendMessage', (data) => {
        io.emit('newMessage', data);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

sequelize.sync({ force: false })
    .then(() => {
        server.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });