import express from 'express';
import { changeUserPassword, deleteUserProfile, loginUser, registerUser, updateUserProfile, getLikedMovies, addlikedMovie, deletelikedMovies, getUsers, deleteUser } from '../Controllers/UserController.js';
import { protect, admin } from '../middlewares/Auth.js';

const router = express.Router(); 

//PUBLIC ROUTES
router.post("/", registerUser);
router.post("/login", loginUser);

//PRIVATE ROUTES
router.put("/", protect,updateUserProfile);
router.delete("/", protect,deleteUserProfile);
router.put("/password", protect, changeUserPassword);
router.get("/favourites", protect, getLikedMovies);
router.get("/favourites", protect, addLikedMovies);
router.get("/favourites", protect, deleteLikedMovies);

//ADMIN ROUTES
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;