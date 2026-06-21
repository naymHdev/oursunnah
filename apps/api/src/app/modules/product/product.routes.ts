import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { ProductValidation } from "./product.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

const router = Router();

// Public — storefront listing & detail
router.get("/", ProductController.getProducts);
router.get("/:slug", ProductController.getProductBySlug);

// Protected — TODO: tighten to admin-only once a role field exists on User.
router.post(
  "/",
  auth(),
  validateRequest(ProductValidation.createProductSchema),
  ProductController.createProduct
);

router.patch(
  "/:id",
  auth(),
  validateRequest(ProductValidation.updateProductSchema),
  ProductController.updateProduct
);

router.delete("/:id", auth(), ProductController.deleteProduct);

export const ProductRoutes = router;
