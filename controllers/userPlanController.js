const plans = require('../models/planModel');

module.exports = {
    getAllPlans: async(req,res)=>{
        try {
            const allplans = await plans.find();
            if(!allplans){
                return res.status(400).json({message:'No plans found'})
            }

            return res.status(200).json({allplans});

        } catch (error) {
            return res.status(500).json({message:"Internal server error"});
        }
    }
}