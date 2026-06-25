import { Router } from "express";
import { UserController } from "./user.controller.js";
import { UserValidation } from "./user.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

const router = Router();

router.get("/me", auth(), UserController.getProfile);
router.patch(
  "/me",
  auth(),
  validateRequest(UserValidation.updateProfileSchema),
  UserController.updateProfile
);

router.get("/me/addresses", auth(), UserController.listAddresses);
router.post(
  "/me/addresses",
  auth(),
  validateRequest(UserValidation.createAddressSchema),
  UserController.createAddress
);
router.patch(
  "/me/addresses/:id",
  auth(),
  validateRequest(UserValidation.updateAddressSchema),
  UserController.updateAddress
);
router.delete("/me/addresses/:id", auth(), UserController.deleteAddress);

export const UserRoutes = router;
