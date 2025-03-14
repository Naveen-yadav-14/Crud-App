const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:[true, "Please enter product name"],

        },
        description:{type:String,required:true},
        category: { type: String, required: true },
        price: { type: Number, required: false },
        discount: { type: Number, required: true },
        discountPrice: { type: Number, required: false },
        quantity:{
                type:Number,
                required:false,
                default:0
        },
        images:[String],
    productPictureOne: { type: String, required: false },
    productPictureTwo: { type: String, required: false },
    productPictureThree: { type: String, required: false },
    },
    {
        timestamps:true,
    }
);


const Product = mongoose.model("Product",ProductSchema);

module.exports = Product;