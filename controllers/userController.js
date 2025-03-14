const Order = require("../models/orderModel");
const Product = require("../models/product.model")
const user = require("../models/userModel")
module.exports={
    addToCart : async(req,res)=>{
        try {
            const productId = req.params.id;
            const userId = req.session.user._id;
           // console.log(userId);
            if(!productId){
                return res.status(400).json({message:"Invalid product Id"})
            }
            if(!userId){
                return res.status(400).json({message:"Invalid user Id"})
            }
            const productExists = await Product.findById(productId);
            if(!productExists){
                return res.status(400).json({message:"product not found"})
            }
            const userExists = await user.findById(userId);
            if(!userExists){
                return res.status(400).json({message:"Invalid user details"})
            }
            if(userExists.cart.includes(productId)){
                userExists.cart.pull(productId);
                await userExists.save();
                return res.status(200).json({message:"Product removed from cart"})
            }
            else{
                userExists.cart.push(productId);
                await userExists.save();
                return res.status(200).json({message:"Product added to the cart"})
            }
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Internal server error"})
        }
    },
    allCartItems:async(req,res)=>{
        try {
            const userId = req.session.user._id;
            console.log(userId)
            const userExists = await user.findById(userId).populate('cart');
            //console.log(userExists);
            if(!userExists){
                return res.status(400).json({message:"Invalid user details"})
            }
            const cart = userExists.cart.map((product)=>{
                return {_id:product._id, title:product.title, description:product.description, price:product.price, discountPrice:product.discountPrice}
            })
            return res.status(200).json({
                cart
            })
        } catch (error) {
            return res.status(500).json({message:"Internal Server error"})
        }
    },
    placeOrder:async(req,res)=>{
        try {
            const userId = req.session.user._id;
            if(!userId){
                return res.status(400).json({message:"Invalid user Id"})
            }
            const userExists = await user.findById(userId);
            if(!userExists){
                return res.status(400).json({message:"Invalid user details"});
            }
            const orderProducts = userExists.cart.map(product => ({
                product: product._id,
                quantity: 1 // Change this if quantity exists in cart
            }));
           // let totalPrice = req.session.user.cart.reduce((total,item)=>total+item.price*item.quantity,0)
           const newOrder = new Order({
            user: userId,
            products: orderProducts // ✅ Store only ObjectIds
        });
                //console.log(newOrder);
                await newOrder.save()
            return res.status(200).json({message:"products ordered successful"})
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Internal server error"})
        }
    }
}