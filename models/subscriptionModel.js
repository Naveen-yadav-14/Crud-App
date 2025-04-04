const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
    plan:{type:mongoose.Schema.Types.ObjectId, ref:'plans'},
    //user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    startDate:{type:Date},
    endDate:{type:Date},
    status:{type:String, enum:['active','expired'], default:'expired' }
})

const subscriber = mongoose.model('subscriber', subscriberSchema);

module.exports = subscriber;