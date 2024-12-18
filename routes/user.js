const express = require('express') ; 
const router = express.Router() ; 
const AddUser = require('../controllers/user') ; 

router.post('/signup' , AddUser) ; 

module.exports = router ; 