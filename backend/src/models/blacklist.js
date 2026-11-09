const mongoose=require('mongoose');
const blacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,'Token is required to be added in blacklist']
    }
}, {timestamps:true});

const tokenBlackListModel = mongoose.model(
    'Blacklist',
    blacklistSchema
);
module.exports=tokenBlackListModel;