import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { CategoryValidation } from "./category.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

const router = Router();

// Public — navbar & storefront
router.get("/", CategoryController.getCategoryTree);
router.get("/:slug", CategoryController.getCategoryBySlug);

// Protected — EDITOR, ADMIN, SUPER_ADMIN
router.post(
  "/",
  auth("EDITOR"),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.patch(
  "/reorder",
  auth("EDITOR"),
  validateRequest(CategoryValidation.reorderCategoriesSchema),
  CategoryController.reorderCategories
);

router.patch(
  "/:id",
  auth("EDITOR"),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete("/:id", auth("ADMIN"), CategoryController.deleteCategory);

export const CategoryRoutes = router;
