const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/files');
const {authenticate} = require('../middlewares/authenticate'); 

router.post('/upload',authenticate ,  uploadFile);

module.exports = router;
