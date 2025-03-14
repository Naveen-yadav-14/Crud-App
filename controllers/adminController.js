const user = require('../models/userModel')
const Product = require('../models/product.model');
const path = require('path');
//const { updateProduct } = require('./productController');
const { deleteFile, handleFileUpload } = require('../middlewares/authMiddleware');
const { deleteProduct } = require('./productController');
module.exports={
    renderDashboard:async(req,res)=>{
        try {
            return res.render('dashboard',{
                success:req.flash("success"),
                error: req.flash("error")
            })
        } catch (error) {
            req.flash("error", "Internal server error");
            return res.redirect("/admin/dashboard");
        }
    },
    renderAllUsers:async(req,res)=>{
        try {
           const allUsers = await user.find().sort({createdAt:-1});
           return res.render("allUsers",{
            allUsers:allUsers,
            success:req.flash("success"),
            error:req.flash("error")
           })
        } catch (error) {
            console.log(error);
            req.flash("error","Internal server error");
            return res.redirect("/admin/dashboard");
        }
    },
    renderAllProducts: async(req,res)=>{
        try {
            const productExists = await Product.find().sort({createdAt:-1});
            return res.render("allProducts",{
                productExists:productExists,
                success:req.flash("success"),
                error:req.flash("error"),
            })
        } catch (error) {
            console.log(error);
            req.flash("error","Internal server error");
            return res.redirect("/admin/dashboard");
        }
    },
    renderProductPage:async(req,res)=>{
        return res.render('addProduct',{
            success:req.flash("success"),
            error:req.flash("error"),
        })
    },
   addProduct:async(req,res)=>{
    try {
        if(!req.files||!req.files.productImages){
            return res.redirect("/admin/addproduct?error=please upload image");
        }
        const { title, description, category, price, discount, discountPrice, quantity } = req.body;
       // console.log("recived data ", req.body);



        let uploadedImages = [];

        // Check if images were uploaded
        if (req.files && req.files.productImages) {
            let productImages = req.files.productImages;

            // Convert to array if only one image is uploaded
            if (!Array.isArray(productImages)) {
                productImages = [productImages];
            }

            // Process up to 3 images
            for (let i = 0; i < productImages.length && i < 3; i++) {
                const uploadedPath = await handleFileUpload(productImages[i], "products");
                uploadedImages.push(uploadedPath);
            }
        }

        // Save to database
        const newProduct = new Product({
            title,
            description,
            category,
            price,
            discount,
            discountPrice,
            quantity,
            images:uploadedImages
        });

        await newProduct.save();
        req.flash('success', 'Product added successfully!');
        res.redirect('/admin/allproducts');
    } catch (err) {
        console.log("error", "encounterd is ",err.message)
        req.flash('error', 'Failed to add product.');
        res.redirect('/admin/dashboard');
    }
   },
   singleProduct:async(req,res)=>{
    try{
    const{ id } = req.params;
   // console.log(id);
    if(!id){
        req.flash("error","Invalid product Id")
        return res.redirect("/admin/allproducts");
    }
    const productExists = await Product.findById(id);
    if(!productExists){
        return res.redirect("/admin/allproducts")
    }
    return res.render("singleProduct",{
        productExists:productExists,
        success:req.flash("success"),
        error:req.flash("error"),
    })
            }catch(error){
                console.log(error);
                req.flash("error","Internal server error");
                return res.redirect("/admin/dashboard");
            }
    },
    updateProduct:async(req,res)=>{
        try {
            const {id} = req.params;
            // const productPictureOne = req.files?req.files.productPictureOne:null;
            // const productPictureTwo = req.files?req.files.productPictureTwo:null;
            // const productPictureThree = req.files?req.files.productPictureThree:null;

            console.log(id);

            if(!id){
                req.flash("error","Invalid product id");
                return res.redirect(`/admin/singleproduct/${id}`)
            }
            const productExists = await Product.findById(id);
           // console.log(productExists);
            if(!productExists){
                req.flash("error","Invalid product details");
                return res.redirect(`/admin/singleproduct/${id}`);
            }
            if (!productExists.images || !Array.isArray(productExists.images)) {
                productExists.images = [];
            }

            const {title,description,category,price,discount,discountprice} = req.body;
            productExists.title = title;
            productExists.description = description;
            productExists.category = category;
            productExists.price = price;
            productExists.discount = discount;
            productExists.discountprice = discountprice;
           // productExists.quantity = quantity;

            // if(productPictureOne){
            //     await deleteFile(productExists.productPictureOne);
            //     const productPictureOnePath = await handleFileUpload(productPictureOne,"productPictures") //picture name, folder name
            //     productExists.productPictureOne = productPictureOnePath; //updating image path in the database
            // }
            // if(productPictureTwo){
            //     await deleteFile(productExists.productPictureTwo);
            //     const productPictureTwoPath = await handleFileUpload(productPictureTwo,"productPictures")
            //     productExists.productPictureTwo = productPictureTwoPath;
            // }
            // if(productPictureThree){
            //     await deleteFile(productExists.productPictureThree);
            //     const productPictureThreePath = await handleFileUpload(productPictureThree,"productPictures")
            //     productExists.productPictureThree = productPictureThreePath;
            // }
           // await productExists.save()

           if (req.files && req.files.productImages) {
            let uploadedImages = req.files.productImages;

            // Convert to array if a single file is uploaded
            if (!Array.isArray(uploadedImages)) {
                uploadedImages = [uploadedImages];
            }

            for (let i = 0; i < uploadedImages.length && i < 3; i++) {
                if (uploadedImages[i] && uploadedImages[i].name) {
                    // Delete old image only if a new image is uploaded
                    if (productExists.images[i]) {
                        await deleteFile(productExists.images[i]);
                    }

                    // Upload new image
                    const uploadedPath = await handleFileUpload(uploadedImages[i], "products");
                    productExists.images[i] = uploadedPath;
                }
            }
        }

        console.log("productImages", productExists.images);

            await productExists.save();
            req.flash("success","Product added successfully")
            res.redirect(`/admin/singleproduct/${id}`)
        } catch (error) {
            console.log(error);
            req.flash("error","Internal server error");
            return res.redirect("/admin/dashboard");
        }
    },

    deleteProduct:async(req,res)=>{
        try {
            const {id} = req.params;
        if(!id){
            req.flash("error","No product found with this id")
            return res.redirect('/admin/dashboard')
        }
        console.log(id);
        const productExists = await Product.findByIdAndDelete(id);
        //console.log("product=",productExists)
        if(!productExists){
            req.flash("error","no product found");
            return res.redirect("/admin/allproducts")
        }

        req.flash("success","product deleted successfull");
        return res.redirect("/admin/allproducts")

        } catch (error) {
            req.flash("error","Internal server error")
            return res.redirect("/admin/allproducts")
        }
    }

}