import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
  try {
      // Retrieve token from cookies or Authorization header
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

      console.log("Token:", token);  // Log token for debugging

      if (!token) {
          throw new ApiError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(decodedToken)
      const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
      console.log(user)
      if (!user) {
          throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
  } catch (error) {
      console.log(error.message);  // Log error message for debugging

      if (error.name === 'TokenExpiredError') {
          throw new ApiError(401, "Access token expired");
      } else {
          throw new ApiError(401, error?.message || "invalid access token");
      }
  }
});
