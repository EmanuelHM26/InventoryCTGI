import express from "express";
import controller from "../controllers/ambientes.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rol.middleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole([1,2,3]), controller.list);
router.get("/:id", verifyToken, verifyRole([1,2,3]), controller.getOne);
router.post("/", verifyToken, verifyRole([1,2,3]), controller.create);
router.put("/:id", verifyToken, verifyRole([1,2,3]), controller.update);
router.delete("/:id", verifyToken, verifyRole([1,2,3]), controller.remove);

export default router;