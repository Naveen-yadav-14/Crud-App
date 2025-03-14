const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.get('/addtocart/:id',userController.addToCart)
userRouter.get('/cartitems',userController.allCartItems)
userRouter.post('/placeorder',userController.placeOrder)

module.exports = userRouter;