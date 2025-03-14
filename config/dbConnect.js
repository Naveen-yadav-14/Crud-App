const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        .then((req,res)=>{
            console.log("Database is connected");
        })
        .catch((req,res)=>{
            console.log("Database is not connected");
        })
    }   catch(error){
        console.log(error);
    }
}

module.exports = connectDB;