

import express from "express";
import { register, login, logout, getCurrent } from "../controllers/authController.js";
import validateBody from "../helpers/validateBody.js";
import { authSchema } from "../schemas/authSchemas.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { updateAvatar } from "../controllers/authController.js";
import { verifyEmail, resendVerificationEmail } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), register);
authRouter.post("/login", validateBody(authSchema), login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrent);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verify", resendVerificationEmail);

authRouter.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
