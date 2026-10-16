

import express from "express";


import { getUserInfo, updateUser, deleteUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";     

const router = express.Router();


router.get('/profile', authMiddleware, getUserInfo);
router.put('/update', authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);

export default router;