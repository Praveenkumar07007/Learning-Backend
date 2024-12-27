import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
  },
  fullname:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  avatar:{
    type:String,   //cloudinary url
    required:true,
  },
  coverImage:{
    type:String,   //cloudinary url
  },
  watchHistory:[
    {
      type:Schema.Types.ObjectId,
      ref:'video'
    }
  ],
  password:{
    type:String,
    required:[true,'Password is required'],

  },
  refreshToken:{
    type:String,
  }
},{timestamps:true});

userSchema.pre("save",async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
})//don't write arrow function here bcoz we need this keyword

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
  {id:this._id,email:this.email,username:this.username,fullname:this.fullname},
    process.env.JWT_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
  );
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {id:this._id,email:this.email,username:this.username,fullname:this.fullname},
    process.env.JWT_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
  );
}


export const User = mongoose.model('user',userSchema);


//jwt is a bearer token means jo usko bhejega uska access lega
