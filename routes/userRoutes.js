const express = require('express');
const userController = require('../controllers/userController');
const userPlanController = require('../controllers/userPlanController');
const subscriptionController = require('../controllers/subscriptionController');
const { isSubscribed } = require('../middlewares/isSubscribed');
const userRouter = express.Router();

userRouter.get('/addtocart/:id',userController.addToCart)
userRouter.get('/cartitems',userController.allCartItems)
userRouter.post('/placeorder',userController.placeOrder)

userRouter.get('/getallplans',userPlanController.getAllPlans);
userRouter.post('/create-order',subscriptionController.createorder);
userRouter.post('/create-subscription',subscriptionController.createSubscription)
userRouter.post('/subscribe',subscriptionController.userSubscribe);
userRouter.post('/verifypayment',subscriptionController.verifyPayment);
userRouter.get('/premium-content',isSubscribed,subscriptionController.premiumContent);


module.exports = userRouter;