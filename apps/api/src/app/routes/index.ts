import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { CategoryRoutes } from "../modules/category/category.routes.js";
import { ProductRoutes } from "../modules/product/product.routes.js";
import { ReviewRoutes } from "../modules/review/review.routes.js";
import { AnalyticsRoutes } from "../modules/analytics/analytics.routes.js";
import { UserRoutes } from "../modules/user/user.routes.js";
import { CartRoutes } from "../modules/cart/cart.routes.js";
import { UploadRoutes } from "../modules/upload/upload.routes.js";
import { JournalRoutes } from "../modules/journal/journal.routes.js";
import { NewsletterRoutes } from "../modules/newsletter/newsletter.routes.js";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/categories", route: CategoryRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/analytics", route: AnalyticsRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/cart", route: CartRoutes },
  { path: "/upload", route: UploadRoutes },
  { path: "/newsletter", route: NewsletterRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Reviews nested under products — mergeParams lets :productId flow into ReviewRoutes
router.use("/products/:productId/reviews", ReviewRoutes);

export default router;

