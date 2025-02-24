const express = require('express')
const app = express()
const mongoose = require('mongoose')
const productRoute = require('./routes/productRoute.js');

const Product = require('./models/product.model.js')

app.use(express.json())

app.use('/api/products',productRoute);







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


mongoose.connect("mongodb+srv://naveendaraboina88:umXXCvNTdlrAEUEz@backenddb.7g5mq.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB")
.then(()=>{
    console.log("Connected to database")
    app.listen(3000,()=>{
        console.log("App listining on port 3000")
    })
})
.catch(()=>{
    console.log("connection failed")
})