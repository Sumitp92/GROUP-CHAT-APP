const express = require('express') ; 
const router = express.Router() ; 
const {AddUser , LoginUser} = require('../controllers/user') ; 

router.post('/signup' , AddUser) ; 
router.post('/login' , LoginUser) ; 


module.exports = router ; 