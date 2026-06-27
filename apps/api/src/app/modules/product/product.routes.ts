import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { ProductValidation } from "./product.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import { uploadMultiple, handleMulterErrors } from "../upload/upload.middleware.js";

const router = Router();

// Public — storefront
router.get("/", ProductController.getProducts);
router.get("/:slug", optionalAuth(), ProductController.getProductBySlug);

// Protected — EDITOR, ADMIN, SUPER_ADMIN
// Supports both:
// 1. JSON: Content-Type: application/json + body as JSON
// 2. Multipart: Content-Type: multipart/form-data + data field (JSON stringified) + images field (files)
router.post(
  "/",
  auth("EDITOR"),
  uploadMultiple,
  handleMulterErrors,
  ProductController.createProduct
);

router.patch(
  "/:id",
  auth("EDITOR"),
  uploadMultiple,
  handleMulterErrors,
  ProductController.updateProduct
);

router.delete("/:id", auth("ADMIN"), ProductController.deleteProduct);

export const ProductRoutes = router;
