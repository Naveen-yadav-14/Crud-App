const mongoose = require('mongoose');

const plansSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    duration:{type:Number,required:true}
})

module.exports = mongoose.model("plans",plansSchema);
