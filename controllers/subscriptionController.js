const plans = require('../models/planModel')
const Razorpay = require('razorpay');
const User = require('../models/userModel');
//const { subscribe } = require('../routes/userRoutes');
const subscriber = require('../models/subscriptionModel');
const crypto = require('crypto');
const { error } = require('console');
const payment = require('../models/paymentModel')

const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_SECRET
})

module.exports = {
    createorder : async(req,res)=>{
        try {
            const {planId} = req.body;
            console.log(planId)
            const userId = req.session.user._id;
            console.log(userId);
            if(!userId){
                return res.status(400).json({message:"user not found"});
            }

            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({message:"user not found"});
            }

            if(!planId){
                return res.status(400).json({message:"Invalid plan Id"});
            }
            const plan = await plans.findById(planId);
            if(!plan){
                return res.status(404).json({msg:"Plan not found"});
            }
            const options = {
                amount : plan.price*100,
                currency:'INR',
                receipt:`order_${Date.now()}`,
                payment_capture:1
            }
            const order = await razorpay.orders.create(options);

            const newPayment = await payment.create({
                orderId:order.id,
                paymentStatus:"PENDING",
                planId:planId,
                userId:userId,
                fullname:User.name,
                paymentAmount:plan.price
            })

            if(!newPayment){
                return res.status(400).json({error:"Error while creating new payment"})
            }

            return res.status(201).json({message:'successful',newPayment});


        } catch (error) {
            console.log(error.message);
            return res.status(500).json({msg:'Internla server error'});
        }
    },
    verifyPayment : async(req,res)=>{
        try {
            const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

            if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature){
                return res.status(400).json({message:"Razorpay order id, payment id, signature required"});
            }

            const paymentExists = await payment.findOne({orderId:razorpay_order_id});
            if(!payment){
                return res.status(404).json({message:"payment not found"})
            }

            const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
            console.log("String to be signed:",sign);
            const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                                             .update(sign)
                                             .digest('hex');
            console.log("expected signature", expectedSignature);
            if(expectedSignature!==razorpay_signature){
                return res.status(400).json({success:false, error:"Invalid signature"})
            }

            //update payment status and payment date
            paymentExists.paymentStatus="SUCCESS";
            paymentExists.paymentDate = new Date();
            await paymentExists.save();

            const user = await User.findById(paymentExists.userId);
            if(!user){
                return res.status(404).json({message:"user not found"});
            }

            const planExists = await plans.findById(paymentExists.planId);
            
            if(!planExists){
                return res.status(404).json({message:"plan not found"});
            }

            const response={
                success:true,
                paymentStatus:paymentExists.paymentStatus,
                orderId:razorpay_order_id,
                paymentId:razorpay_payment_id,
                userDetails:{
                    name:user.name
                }
            }

            return res.status(200).json({message:'successful',response});

        } catch (error) {
            console.log(error.message);
            return res.json(500).json({message:"Internal server error"})
        }
    },
    createSubscription : async (req, res) => {
        try {
            const { planId, total_count, userEmail } = req.body;
    
            if (!planId || !total_count || !userEmail) {
                return res.status(400).json({ error: "Missing planId, total_count, or userEmail" });
            }
    
            const subscription = await razorpay.subscriptions.create({
                plan_id: planId,  // Razorpay Plan ID
                total_count: total_count, // Number of billing cycles
                customer_notify: 1,
                notify_info: { email: userEmail }
            });
    
            // Return JSON with Payment URL
            return res.json({
                success: true,
                subscription_id: subscription.id,
                payment_url: `https://checkout.razorpay.com/v1/checkout.js?subscription_id=${subscription.id}`
            });
    
        } catch (error) {
            console.error("Error creating subscription:", error);
            res.status(500).json({ error: "Failed to create subscription" });
        }
    },
    userSubscribe:async(req,res)=>{
        try {
            const userId = req.session.user._id;
            const user = await User.findById(userId);
            //console.log(user);
            if(!user){
                return res.status(400).json({message:'user not found'});
            }
            const {planId} = req.body;
            const plan = await plans.findById(planId);
            if(!plan){
                return res.status(400).json({message:'plan not found'});
            }
            const startDate = new Date();
            const endDate = new Date();

            endDate.setDate(startDate.getDate()+plan.duration);
            user.subscription = {
                plan:planId,
                startDate:startDate,
                endDate:endDate,
                status:'active'
            };

            const result = await user.save();
            return res.status(201).json(result);


        } catch (error) {
            console.log(error.message);
            return res.status(500).json({message:'Internal server error'});
        }
    },
    premiumContent: async(req,res)=>{
        try {
            return res.status(200).json({msg:'welcome to premium content'});
        } catch (error) {
            return res.status(500).json({msg:"Internal server error"})
        }
    }
}
