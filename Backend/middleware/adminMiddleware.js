const adminOnly=(req,res,next)=>{
  if(!req.user||req.user.role!="admin"){
    return res.status(403).json({
      success:false,
      message:"admin access is required",
    })
  }

  next();
};
module.exports={adminOnly};
