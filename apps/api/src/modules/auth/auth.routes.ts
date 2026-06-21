import { Router } from "express";
import { registerSchema, loginSchema } from "@our-sunnah/validation";
import { validate } from "../../middlewares/validate.middleware.js";
import { authController } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
