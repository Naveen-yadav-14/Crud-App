const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    products:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
            title: String,
            price: Number,
            discountPrice: Number,
            quantity: Number,
            itemTotal: Number
        }
    ],
    totalPrice:{type:Number,required:false},
    status:{type:String, enum:["Pending","Shipped","Deliverd"], default:"Pending"},
    orderedAt:{type:Date, default:Date.now}
})

const Order = mongoose.model('Order',orderSchema);
module.exports = Order