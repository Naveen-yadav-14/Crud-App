const Order = require("../models/orderModel");
const Product = require("../models/product.model")
const User = require("../models/userModel")
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
            const userExists = await User.findById(userId);
            if(!userExists){
                return res.status(400).json({message:"Invalid user details"})
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId, "cart.productId": productId },
                { $inc: { "cart.$.quantity": 1 } },  // Increment quantity
                { new: true }
            );

            if(updatedUser){
                return res.status(200).json({message:'cart incremented'})
            }
    
            // If product doesn't exist, add it
            if (!updatedUser) {
                await User.findByIdAndUpdate(userId, {
                    $push: { cart: { productId, quantity: 1 } }
                });
                return res.status(200).json({message:'product added to cart'})
            }
    
            //return res.status(200).json({ message: "Cart updated successfully" });
           

        }catch(error){
            console.log(error.message);
            res.status(500).json({message:"Internal server error"})
        }
    },
    allCartItems:async(req,res)=>{
        try {
            const userId = req.session.user._id;
            console.log(userId)
            const userExists = await User.findById(userId).populate('cart');
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
            const user = await User.findById(userId).populate({
                path: "cart.productId", 
                select: "title price discount"
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            if (user.cart.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            let totalPrice = 0;
            const products = user.cart.map(item => {
                if (!item.productId) return null; // Skip if product is missing
    
                const product = item.productId;
                const itemTotal = item.quantity * (product.discountPrice || product.price);
                totalPrice += itemTotal;
    
                return {
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    discountPrice: product.discountPrice || product.price,
                    quantity: item.quantity,
                    itemTotal: itemTotal
                };
            }).filter(item => item !== null);
    
            if (products.length === 0) {
                return res.status(400).json({ message: "Cart contains unavailable products" });
            }
    
            // ✅ Create Order in Database
            const newOrder = new Order({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                products: products,
                totalPrice: totalPrice,
                status: "Pending"
            });
    
            await newOrder.save();
    
            // ✅ Clear Cart after Order
            user.cart = [];
            await user.save();
    
            res.status(200).json({ message: "Order placed successfully", order: newOrder });

        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Internal server error"})
        }
    }
}