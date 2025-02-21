const express=require('express')

const { getMessage, sendMessage } = require('../controller/messageController.js');
const { requireSignin} = require('../controller/userController');
const router = express.Router();
// requireSignin,
// protectRoute, 
router.get('/:id',  requireSignin,getMessage);
router.post('/send/:id', requireSignin,sendMessage);

module.exports = router;
