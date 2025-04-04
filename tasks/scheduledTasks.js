const cronJob = require('node-cron');
const User = require('../models/userModel');

exports.initScheduledJobs = ()=>{
    const scheduledJobFunctions = cronJob.schedule("0 0 * * *", async()=>{
        try {
            const today = new Date();
            await User.updateMany(
                {"subscription.endDate":{$lt:today}},
                {$set:{'subscription.status':"expired"}}
            )

            console.log("subscription status updated")
        } catch (error) {
            console.log('error updating status');
        }
    });
    scheduledJobFunctions.start();
}