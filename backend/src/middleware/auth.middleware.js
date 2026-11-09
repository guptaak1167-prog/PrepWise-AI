const jwt=require('jsonwebtoken');
const blackListToken=require('../models/blacklist');
async function authCheck(req,res,next){
  const token=req.cookies.token;
  if(!token) return res.status(401).json({message:"token is not provided"});
  const isTokenBlackListed=await blackListToken.findOne({token})
  if(isTokenBlackListed){
    return res.status(401).json({message:"token is invalid"});
  }
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);//it verify the token is it valid or not becuase it is possible that someone has modified the token but backend does not believe so that it needs
    req.user=decoded;
    next();
  }catch(err){
    return res.status(401).json({message:"token is invalid"});
  }
}
module.exports={authCheck}