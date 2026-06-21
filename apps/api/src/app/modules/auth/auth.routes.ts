import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import requireInternalSecret from "../../middleware/requireInternalSecret.js";

const router = Router();

router.post(
  "/create-account",
  validateRequest(AuthValidation.createAccountSchema),
  AuthController.createAccount
);

router.post(
  "/login-account",
  validateRequest(AuthValidation.loginSchema),
  AuthController.loginAccount
);

router.post("/logout", AuthController.logoutAccount);

router.post(
  "/social",
  requireInternalSecret,
  validateRequest(AuthValidation.socialLoginSchema),
  AuthController.socialLogin
);

export const AuthRoutes = router;
