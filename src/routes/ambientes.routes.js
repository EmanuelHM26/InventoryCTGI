import express from "express";
import controller from "../controllers/ambientes.controller.js";

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;