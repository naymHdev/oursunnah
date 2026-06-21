import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { CategoryValidation } from "./category.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

const router = Router();

// Public — used for navbar/storefront rendering
router.get("/", CategoryController.getCategoryTree);
router.get("/:slug", CategoryController.getCategoryBySlug);

// Protected — TODO: tighten to admin-only once a role field exists on User.
// `auth()` currently only proves the request is from a logged-in user.
router.post(
  "/",
  auth(),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory
);

router.patch(
  "/reorder",
  auth(),
  validateRequest(CategoryValidation.reorderCategoriesSchema),
  CategoryController.reorderCategories
);

router.patch(
  "/:id",
  auth(),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory
);

router.delete("/:id", auth(), CategoryController.deleteCategory);

export const CategoryRoutes = router;
