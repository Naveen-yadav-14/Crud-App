const user = require("../models/userModel");
const fs = require('fs').promises;
const path = require("path");
const jwt = require('jsonwebtoken');

exports.generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET_KEY,{
        expiresIn:'346d'
    })
}

exports.isAdmin = async(req,res,next)=>{
    if(!req.session.isAuth){
        return res.redirect("/auth/login");
    }
    const admin = await user.findOne({_id:req.session.admin._id, isAdmin:true});
    if(!admin){
        req.flash("error","Unauthorized user");
        return res.redirect("/auth/login");
    }
    else{
        req.session.admin = admin;
        next();
    }
}

// //file deleting
// exports.deleteFile = async (filepath)=>{
//     const FilePath = path.join(__dirname,"..",filepath);
//     console.log(FilePath);
//     try{
//         await fs.access(FilePath);
//         await fs.unlink(FilePath);
//         console.log(`File deleted successfully: ${FilePath}`);

//     }catch(err){
//         if(err.code==='ENOENT'){
//             console.log(`file not found ${FilePath}`)
//         } else{
//             console.log(`error deleting file${err}`)
//         }
//         return true;
//     }
//     return true;
// }
// exports.handleFileUpload = async (file, destination) => {
//     if (!file) return null; // Return null if no file is provided

//     const extension = path.extname(file.name);
//     const filename = `${Date.now()}${extension}`;

//     await file.mv(`./uploads/${destination}/${filename}`)
//     return `uploads/${destination}/${filename}`;
    
// };

exports.handleFileUpload = async (file, destination) => {
    if (!file || !file.name) {
        console.warn("handleFileUpload: No file provided for upload.");
        return null; // Return null if no file is uploaded
    }

    const uploadDir = path.join(__dirname, "..", "public", "uploads", destination);
    
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory: ${error}`);
        throw new Error("Failed to create upload directory");
    }

    const extension = path.extname(file.name);
    const filename = `${Date.now()}${extension}`;
    const filePath = path.join(uploadDir, filename);

    // Move file
    await file.mv(filePath);

    return `uploads/${destination}/${filename}`; // Relative path for database storage
};

// Function to handle file upload
exports.deleteFile = async (filepath) => {
    if (!filepath) {
        console.warn("deleteFile: No file path provided.");
        return false;
    }

    const fullPath = path.join(__dirname, "..", "public", filepath);
    
    try {
        await fs.access(fullPath);
        await fs.unlink(fullPath);
        console.log(`File deleted successfully: ${fullPath}`);
        return true;
    } catch (err) {
        if (err.code === "ENOENT") {
            console.warn(`File not found: ${filepath}`);
        } else {
            console.error(`Error deleting file: ${err}`);
        }
        return false;
    }
};