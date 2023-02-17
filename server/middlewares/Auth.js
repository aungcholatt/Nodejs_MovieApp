
import jwt, { verify } from "jsonwebtoken";
import User from "../Models/UserModel.js";
import asyncHandler from "express-async-handler";

//@desc Authenticated user & get token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
//projection middleware
const protect = asyncHandler(async (req, res, next) =>{
    let token;
    //check if token exists in headers
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ){
        //set token from Bearer token in header
        try{
            token = req.headers.authorization.split("")[1];
            //verify token and get user id
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //get user id from decoded token
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(error){
         console.error(error);
         res.status(401);
         throw new Error("Not authorized, Token failed");
        }
    }
    //if token doesn't exist in headers send error 
    if (!token){
        res.status(401);
        throw new Error("Not authorized, No token");
    }
});
export { generateToken, protect };