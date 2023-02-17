import asyncHandler from 'express-async-handler';
import User from '../Models/UserModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middlewares/Auth.js'

//@desc : Register user
//@route : POST /api/users/
//@access : Public
const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password, image} = req.body
    try {
        const userExists = await User.findOne({ email });
        //check if user exists 
        if (userExists){
            res.status(400);
            throw new Error ("User already exists");
        }
        //hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //cteate user in DB
      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        image,
      });

      //if user created successfully send user data and token to client 
      if (user) {
        res.status.apply(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }catch(error){
      res.status(400).json({ message: error.message });
    }
});

//@desc : Login user
//@route : POST /api/users/
//@access : Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try{
    //find user in DB
    const user = await User.findOne({ email });
    //if user exists compare password with hashed password then send user data and token to client
    if (user && (await bcrypt.compare(password, user.password))){
       res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
       });
       //if user not found or password not match send error message
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch(error){
    res.status(400).json({ message: error.message });
  }
});

//Private Controllers

//@desc Update user profile
//@route PUT /api/users.profile
//@access Private
const updateUserProfile = asyncHandler(async(req, res)=>{
  const { fullName, email, image } = req.body;
  try{
    //find user in DB
    const user = await User.findById(req.user._id);
    //if user exists update user data and save it in DB
    if(user){
      user.fullName = fullName || user.fullName;
      user.email = fullName || user.email;
      user.image = fullName || user.image;

      const updateUser = await user.save();
      //send update user data and token to client
      res.json({
        _id: updatedUser._id,
        fullName: updateUser.fullName,
        email: updateUser.email,
        image: updateUser.image,
        isAdmin: updateUser.isAdmin,
        token: generateToken(updateUser._id),
      });
    }
    //else send error message
    else{
      res.status(404);
      throw new Error("User not found");
    }
  }catch(error){
    res.status(400).json({ message: error.message });
    }
  });

  //@desc : Delete user profile
  //@route DELETE /api/users
  //@access Private
  const deleteUserProfile = asyncHandler(async (req, res)=> {
    try{
      //find user in DB
      const user = await User.findById(req.user._id);
      //if user exists delete user from DB
      if(user){
        //if user is delete throw error message 
        if(user.isAdmin){
          res.status(400);
          throw new Error("Can't delete admin user");
        }
        //else delete user from DB
        await user.remove();
        res.json({ message:"User deleted successfully"});
      }
      //else send error message
      else{
        res.status(404);
        throw new Error("User not found");
      }
      }catch(error){
        res.status(400).json({ message: error.message });
      }
  });

  //@desc : Change user password
  //@route PUT /api/users/password
  //@access Private
  const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try{
      //find user in DB
      const user = await User.findById(req, user_id);
      //if user exists compare old password with hashed password 
      if(user && (await bcrypt.compare(oldPassword, user.password))){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Password changed!! "});
    }
    //else send error message
    else {
      res.status(401);
      throw new Error ("Invalid old Password");
    }
  }catch(error){
    res.status(400).json({ message: error.message });
  }
  });

export { registerUser, loginUser, updateUserProfile, deleteUserProfile, changeUserPassword };