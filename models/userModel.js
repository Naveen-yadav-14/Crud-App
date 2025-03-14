const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  isAdmin:{type:Boolean,default:false},
  name:{type:String,required:false},
  phoneNumber:{type:Number,required:false,unique:true},
  dob:{type:String,required:false,default:"NA"},
  age:{type:Number,required:false,default:18},
  gender:{type:String,required:false,default:"NA"},
  cart:[
    {
    productId: {type:mongoose.Schema.Types.ObjectId, ref:'Product'},
    quantity:{type:Number, default:1}
    }
  ],
  authToken:{type:String,required:false}
});

module.exports = mongoose.model("User", UserSchema);
