const express = require('express');
const varifyToken = require('../util/varifyUser');
const { updateUser, deleteUser } = require('../controller/userController');
const { rateLimiter } = require('../middleware/rateLimit')
const { updateUserDataValidationRules, validateRequest } = require('../middleware/validation')
const router = express.Router()
router.post('/update/:id', rateLimiter, updateUserDataValidationRules(), validateRequest, varifyToken, updateUser)
router.delete('/delete/:id', rateLimiter, varifyToken, deleteUser)
module.exports = router;