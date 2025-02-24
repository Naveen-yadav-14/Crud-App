const express = require('express');
const Product = require('../models/product.model.js');

//get all products
const getProducts = async(req,res)=>{
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}

//get one product
const getProduct = async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if(!product){
            res.status(400).json({message:"product not found"})
        }

        res.status(200).json(product);
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//save product
const postProduct = async(req,res)=>{
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//update product
const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);

        if(!product){
            res.status(400).json({message:"product not found"});
        }

        const updatedProduct = Product.findById(id);
        res.status(200).json(updatedProduct);

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

//delete a product
const deleteProduct = async(req,res)=>{
   
    try {
        const {id} = req.params;
        const data = await Product.findByIdAndDelete(id);
        if(!data){
            res.status(400).json({message:"product not found"})
        }
        res.status(200).json({message:"product deleted successfully"});

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports={
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct
}