const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    orderId:{type:String},
    paymentStatus:{type:String},
    planId:{type:String},
    userId:{type:String},
    fullname:{type:String},
    paymentAmount:{type:Number},
    paymentDate:{type:Date}
})

const payment = mongoose.model('Payment',paymentSchema);

module.exports = payment;
