const express = require('express')
const router = express.Router()
const { rateLimiter } = require('../middleware/rateLimit')
const { signupValidationRules, loginValidationRules, validateRequest, googleLoginValidationRules } = require('../middleware/validation')
const AuthController = require('../controller/authConroller')
// router.post('/signup',  AuthController.signup)

router.post('/signup', rateLimiter, signupValidationRules(), validateRequest, AuthController.signup)
router.post('/login', rateLimiter, loginValidationRules(), validateRequest, AuthController.login)
router.post('/google', rateLimiter, googleLoginValidationRules(), validateRequest, AuthController.google)
router.get('/signout', rateLimiter, AuthController.signOut)
module.exports = router