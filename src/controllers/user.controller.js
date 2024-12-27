import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation -> not empty
  //check if user already exists:username , email
  //check for images , check for avatar
  // upload them to cloudinary,avatar
  //create user object - create entry in db
  // remove password and refresh token field from response
  //check for user creation
  // return res
  const {fullName,email , username,password}=req.body
  console.log("email",email);
  if(
    [fullName,email,username,password].some((field)=>field?.trim()==="")
  ){
    throw new ApiError(400,"Please fill in all fields")
  }

  const existedUser = User.findOne({
    $or:[{email},{username}]
  });

  if(existedUser){
    throw new ApiError(409,"User already exists")
  }

  //check for images , check for avatar
  const avatarLocalPath =  req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if(!avatarLocalPath){
    throw new ApiError(400,"Please upload an avatar image")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(500,"Failed to upload avatar image")
  }

   const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || null,
    email,
    username:username.toLowerCase(),
    password
  });

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500,"Failed to create user")
  }

  return res.status(201).json({
    new ApiResponse(200,,createdUser,"User created successfully")
  })


});


export {registerUser};