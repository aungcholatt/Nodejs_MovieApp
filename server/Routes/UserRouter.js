import express from 'express';
import { changeUserPassword, loginUser, registerUser, updateUserProfile, deleteUserProfile } from '../Controllers/UserController.js';
import { protect } from '../middlewares/Auth.js';

const router = express.Router(); 

//PUBLIC ROUTES
router.post("/", registerUser);
router.post("/login", loginUser);

//Provate Routes
router.put("/", protect,updateUserProfile);
router.delete("/", protect,deleteUserProfile);
router.put("/password", protect, changeUserPassword);

export default router;