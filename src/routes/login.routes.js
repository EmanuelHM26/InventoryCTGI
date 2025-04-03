import express from "express";
import { createUser, getUsers, getUserById, loginUser } from "../controllers/login.controller.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/login",loginUser);

export default router;
