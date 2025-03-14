const Order = require("../models/orderModel")

module.exports={
    getAllOrders: async(req,res)=>{
        try {
            const orders = await Order.find()
            .populate({ path: "user", select: "name email" })  // Get user details
            .populate({ path: "products.product", select: "title price" }); // Get product details

             //console.log(JSON.stringify(orders, null, 2)); 
            return res.render('orders',{orders});
        } catch (error) {
            return req.flash("error","Error while fetching orders")
        }
    }
}