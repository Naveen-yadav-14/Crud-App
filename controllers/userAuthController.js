const User = require('../models/userModel.js')
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const { generateToken } = require('../middlewares/authMiddleware.js');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

//   console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);



module.exports = {
    
    register:async(req,res)=>{
        try {
                const {email,password,age,dob,phoneNumber,gender,name} = req.body;

                if (!email || !password) {
                    return res.status(400).json({ msg: "Email and password are required" });
                }

                let user = await User.findOne({email});
                // if(user)
                // {
                //     return res.status(400).json({msg:"user already exist"})
                // }

               // console.log(email,password);
        
                //hashing password
                const salt = await bcrypt.genSalt(10);

                //console.log("Password before hashing:", password); // Debugging log

                const hashedPassword = await bcrypt.hash(password, salt);
              //  console.log("Hashed Password:", hashedPassword); // Debugging log
        
                //generating otp
                const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        
                const otpExpires = new Date();
            otpExpires.setMinutes(otpExpires.getMinutes() + 10); // OTP valid for 5 mins
        
            // Create User
            user = new User({ email, password: hashedPassword, otp, otpExpires,age,dob,phoneNumber,gender,name });
            const token = generateToken(user._id);
            user.authToken = token;
            await user.save();
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "OTP Verification",
                text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
              });
          
              res.status(200).json({ msg: "OTP sent to email", email });
        
        } catch (error) {
            res.status(500).json({error:error.message});
        }
    },

    verifyOtp:async(req,res)=>{
        try {
            const {email,otp} = req.body;
            const user = await User.findOne({email});

           // console.log(user);
            if(!user){
                return res.status(400).json({msg:"user not found"})
            }

           // console.log(otp,user.otp,new Date(),user.otpExpires);

            if(otp!==user.otp||new Date()>user.otpExpires){
                return res.status(400).json({msg:"Invalid otp or otp expried"});
            }

           

            user.otp = null;
            user.otpExpires = null;
            user.isVerified = true;

            await user.save();

            res.status(200).json({msg:"Otp verified"})

        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },

    login:async(req,res)=>{
        try {
            const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({msg:"Please enter correct details"})
        }

        const userExists = await User.findOne({email});
        if(!userExists){
            return res.status(400).json({msg:"user not found"})
        }

        const existingPassword = userExists.password;
        const isMatch = bcrypt.compare(password,existingPassword);

        if(!isMatch){
            return res.status(400).json({msg:"Invalid credintials"})
        }
        const token = generateToken(userExists._id)
        userExists.authToken = token;
        await userExists.save();
        req.session.user = userExists;
        res.status(200).json({msg:"login successfull"});


        } catch (error) {
            res.status(500).json({error:error.message});
        }

    }


    }
