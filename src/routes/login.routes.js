import express from "express";
import { createUser, getUsers, getUserById, loginUser } from "../controllers/login.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/register", createUser);
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/login",loginUser);

export default router;

