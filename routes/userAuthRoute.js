const userAuthController = require('../controllers/userAuthController');

const userAuthRouter = require('express').Router();

userAuthRouter.post('/register',userAuthController.register);

userAuthRouter.post('/verifyotp',userAuthController.verifyOtp);

userAuthRouter.post('/login',userAuthController.login);

module.exports = userAuthRouter;