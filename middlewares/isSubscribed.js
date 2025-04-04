const subscriber = require("../models/subscriptionModel");
const User = require('../models/userModel');
exports.isSubscribed = async(req,res,next)=>{
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        //console.log(user)
        if(!user.subscription||user.subscription.status!=='active'){
            return res.status(400).json({error:'subscription required'})
        }
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:'Internal server error'});
    }
}