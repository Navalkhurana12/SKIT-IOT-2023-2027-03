const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const UserSchema=new mongoose.Schema({
 
  name:{
    type:String,
    required:true,
    trim:true
  },

  rollNo:{
    type:String,
    required:function(){
      return this.role==="user";
    },
    unique:true,
    trim:true,
    uppercase:true,
  },
  
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
  },

  password:{
    type:String,
    required:true,
    minlength:6,
    select:false
  },
  avatar:{
    type:String,
    default:"",
  },
  role:{
    type:String,
    enum:["user","admin"],
    default:"user",
  },
  isVerified:{
    type:Boolean,
    default:false,
  },
  otp:{
    type:String,
    select:false,
  },
  otpExpires:{
    type:Date,
    select:false,
  },
},
{timestamps:true}
);

UserSchema.pre("save",async function(){
  if(!this.isModified("password"))return ;

  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
});

UserSchema.methods.matchPassword=async function(enteredPassword){
  return bcrypt.compare(enteredPassword,this.password);
};

module.exports=mongoose.model("User",UserSchema);
