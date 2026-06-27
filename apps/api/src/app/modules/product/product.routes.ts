import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { ProductValidation } from "./product.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";
import optionalAuth from "../../middleware/optionalAuth.js";

const router = Router();

// Public — storefront
router.get("/", ProductController.getProducts);
router.get("/:slug", optionalAuth(), ProductController.getProductBySlug);

// Protected — EDITOR, ADMIN, SUPER_ADMIN
router.post(
  "/",
  auth("EDITOR"),
  validateRequest(ProductValidation.createProductSchema),
  ProductController.createProduct
);

router.patch(
  "/:id",
  auth("EDITOR"),
  validateRequest(ProductValidation.updateProductSchema),
  ProductController.updateProduct
);

router.delete("/:id", auth("ADMIN"), ProductController.deleteProduct);

export const ProductRoutes = router;
