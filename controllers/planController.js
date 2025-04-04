const Plan = require('../models/planModel')

module.exports = {
    addPlan: async(req,res)=>{
        try {
            const {name,price,duration} = req.body;
            if(!name||!price||!duration){
                req.flash('error',"error while adding plan");
                return res.redirect('/admin/dashboard');
            }

            const newPlan = new Plan({
                name,
                price,
                duration
            })

            await newPlan.save();
            req.flash('success','Plan added successful');
            return res.redirect('/admin/allplans')

        } catch (error) {
            console.log(error.message);
            return res.redirect('/admin/dashboard')
        }
    },
    renderAllPlans:async(req,res)=>{
        try {
            const allPlans = await Plan.find()
          return res.render('allPlans',{
                allPlans:allPlans,
                success:req.flash('success'),
                error:req.flash('error'),
            })
        } catch (error) {
            req.flash('error','error while fetching plans');
            return res.redirect('admin/dashboard')
        }
    },
    deletePlan: async(req,res)=>{
        try {
            const planId = req.params.id;
            console.log(planId);
            if(!planId){
                req.flash("error","Invalid plan Id");
                return res.redirect('admin/dashboard');
            }
            const plan = await Plan.findByIdAndDelete(planId);
            if(!plan){
                req.flash('error',"error while deleting plan");
                return res.redirect('/admin/allplans');
            }

            req.flash('success','Plan deleted successful');
            return res.redirect('/admin/allplans')
        } catch (error) {
            req.flash('error','Internal server error');
            return res.redirect('/admin/dashboard');
        }
    },
    updatePlan: async(req,res)=>{
        try {
            const planId = req.params.id;
            if(!planId){
                req.flash('error','Invalid Plan Id');
                return res.redirect('/admin/allplans')
            }

            const existingPlan = await Plan.findById(planId);

            const{name,price,duration} = req.body;

            existingPlan.name = name;
            existingPlan.price = price;
            existingPlan.duration = duration;

            await existingPlan.save();

            req.flash('success','Plan updated successful');
            return res.redirect('/admin/allplans')

        } catch (error) {
            req.flash('error','error while updating plan');
            return res.redirect('/admin/dashboard')
        }
    }
}