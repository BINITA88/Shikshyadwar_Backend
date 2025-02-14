const express=require('express')

const { getMessage, sendMessage } = require('../controller/messageController.js');
const { requireSignin} = require('../controller/userController');
const router = express.Router();
// requireSignin,
// protectRoute, 
router.get('/:id',   getMessage);
router.post('/send/:id', sendMessage);

module.exports = router;
