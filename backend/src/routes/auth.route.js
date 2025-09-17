import express from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// Protected Routes
router.use(protectRoute); // Applies protectRoute middleware to all routes below

router.put("/update-profile", AuthController.updateProfile);
router.get("/check", AuthController.checkAuth);

export default router;
