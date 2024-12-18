const Sequelize = require('sequelize') ; 
const express = require('express');
const sequelize = require('./util/databases'); 
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


const GeneralRoutes = require('./routes/user') ; 

app.use('/api' , GeneralRoutes) ; 

const User = require('./model/userdetail') ; 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/' , (req , res) =>{
    res.sendFile(path.join (__dirname, 'public', 'login.html')) ; 
});
// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

sequelize.sync({ force: false })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });