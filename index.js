require("dotenv").config();

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


const express = require('express')
const expressSession = require('express-session')
const mongoDBSession = require('connect-mongodb-session')(expressSession)
const hbs = require('hbs');
const flash = require('connect-flash')
const mongoose = require('mongoose')
const productRoute = require('./routes/productRoute.js');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload')
const fs = require('fs')
const methodOverride = require('method-override');

// const mongoDBSession = require('connect-mongodb-session')

const Product = require('./models/product.model.js');
const userAuthRouter = require('./routes/userAuthRoute.js');
const adminAuthRouter = require("./routes/adminRoutes/adminAuRouter.js");
const connectDB = require("./config/dbConnect.js");
const { isAdmin, isValidToken } = require("./middlewares/authMiddleware.js");
const adminRouter = require("./routes/adminRoutes/adminRouter.js");
const registerHelpers = require("./helpers/helpers.js");
const userRouter = require("./routes/userRoutes.js");
const { initScheduledJobs } = require("./tasks/scheduledTasks.js");

const app = express()
//connect db
connectDB();

initScheduledJobs();

registerHelpers();

const store = new mongoDBSession({
    uri:process.env.MONGO_URI,
    collection:"userSessions",
})
//middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(flash());
app.use(fileUpload());
app.use(methodOverride('_method'));


app.use(expressSession({
    secret:"thisIsSecretKey!",
    resave:false,
    saveUninitialized:false,
    store:store,
}))

//template engine
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "hbs");
app.engine("html",hbs.__express);
app.use(express.static(path.join(__dirname, "public")));

 hbs.registerPartials(path.join(__dirname, "views", "partials"))
//server upload as static images
app.use("/uploads", express.static(path.join(__dirname,'/public/uploads')))

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/api/products',productRoute);
app.use('/api',userAuthRouter);

//admin auth
app.use('/auth',adminAuthRouter);
//admin access
app.use('/admin',isAdmin,adminRouter)
//user router
app.use('/user',isValidToken, userRouter)

app.listen(process.env.PORT, async(req,res)=>{
    console.log(`server listening to port...${process.env.PORT}`);
})









// app.get('/api/getallproducts',async(req,res)=>{
//     try {
//         const products = await Product.find({});
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({message:error.message});
//     }
// })

// app.get('/api/getproduct/:id',async(req,res)=>{
//     try {
//         const {id} = req.params
//         const product = await Product.findById(id)
//         res.status(200).json(product);
        
//     } catch (error) {
//         res.status(500).json({message:error.message});
//     }
// })

// app.post("/api/products",async(req,res)=>{
//     try {
//         const data = await Product.create(req.body);
//         res.status(200).json(data);
        
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// })

//update a product
// app.put('/api/update/:id',async(req,res)=>{
//     try {
//         const {id} = req.params;
//         const product = await Product.findByIdAndUpdate(id, req.body, {new:true});

//         if(!product){
//             return res.status(404).json({message:"Product not found"});

//         }

//         const updatedProduct = await Product.findById(id);
//         res.status(200).json(updatedProduct);

//     } catch (error) {
//         res.status(500).json({message:error.message});
//     }
// })

// //delete a product
// app.delete('/api/delete/:id', async(req,res)=>{
//     try {
//         const {id} = req.params;
//         const product = await Product.findByIdAndDelete(id);

//         if(!product){
//             res.status(400).json({message:"Product not found"})
//         }
//         res.status(200).json({message:"Product deleted successfully"})
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// })


