import { Router } from "express";
import requireApiKey from "../middlewares/authMiddleware.js";
import {
  createUserHandler,
  deleteUserHandler,
  getUserDetails,
  updateUserHandler,
    getAllUsers
} from "../controllers/userController.js";

const router = Router();

router.post("/", requireApiKey, createUserHandler);
router.get("/:id", requireApiKey, getUserDetails);
router.patch("/:id", requireApiKey, updateUserHandler);
router.delete("/:id", requireApiKey, deleteUserHandler);
router.get("/", getAllUsers);

export default router;
