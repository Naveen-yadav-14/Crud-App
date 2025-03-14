const { isAdmin } = require("../middlewares/authMiddleware");
const user = require("../models/userModel")
const bcrypt = require('bcryptjs')

module.exports = {
    renderLogin:async (req,res)=>{
        return res.render('index',{
            success:req.flash("success"),
            error:req.flash("error")
        });
    },
    login:async(req,res)=>{
        const {email, password} = req.body;
        const adminExists = await user.findOne({email, isAdmin:true})
        //console.log(adminExists,isAdmin);
        if(!adminExists||!adminExists.isAdmin){
            req.flash("error","you dont have admin acess");
            return res.redirect("/auth/login");
        }

        const matchPassword =  adminExists.password;
        const matched = await bcrypt.compare(password,matchPassword)
        if(!matched){
            req.flash("error","password is wrong");
            res.redirect('/auth/login');
        }
        req.session.isAuth = true;
        req.session.admin = adminExists;
        req.session.save(err=>{
            if(err){
                return next(err)
            }
            return res.redirect('/admin/dashboard');
        })
    },
    logout: async(req,res)=>{
        req.session.destroy();
        res.redirect("/auth/login");
    }
}