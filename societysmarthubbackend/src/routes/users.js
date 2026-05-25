import { Router } from "express";
import { list, create, get, update, remove } from "../controllers/usersController.js";

const router = Router();
router.get("/", list);
router.post("/", create);
router.get("/:id", get);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
