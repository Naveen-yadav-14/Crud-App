const Order = require("../models/orderModel")

module.exports={
    getAllOrders: async(req,res)=>{
        try {
            const orders = await Order.find()
            .populate({ path: "user", select: "name email" })  // Get user details
            .populate({ path: "products.product", select: "title price discount discountPrice" }); // Get product details

             //console.log(JSON.stringify(orders, null, 2)); 
            return res.render('orders',{orders});
        } catch (error) {
            return req.flash("error","Error while fetching orders")
        }
    },
    deleteOrder: async(req,res)=>{
        try {
            const orderId = req.params.id;
            //console.log(orderId)
            if(!orderId){
                //return req.flash(error,"orderId not found")
                req.flash('error','order not found with this ID');
                return res.redirect('/admin/getorders');
            }
            const deleted = await Order.findByIdAndDelete(orderId);
            //console.log(deleted);
            if(!deleted){
                req.flash('error','error while deleteing order');
                return res.redirect('/admin/getorders');
            }
            req.flash('success','order deleted successful');
            return res.redirect('/admin/getorders')
        } catch (error) {
            console.log(error.message)
             req.flash('error','error while deleting order')
            return res.redirect('/admin/getorders')
            }
    },
    updateOrderStatus: async(req,res)=>{
        try {
            const orderId = req.params.id;
            const newStatus = req.body.status;
            if(!orderId||!newStatus){
                req.flash('error','Invalid orderID or Status')
                return res.redirect('/admin/getorders')
            }

            const updateOrder = await Order.findByIdAndUpdate(orderId, {status:newStatus})
            if(!updateOrder){
                req.flash('error','Order not found');
                return res.redirect('/admin/getorders');
            }

            req.flash('success','order updated successful')
            return res.redirect('/admin/getorders')
        } catch (error) {
            req.flash('error','Internal server error');
            return res.redirect('/admin/getorders');
        }
    }

}