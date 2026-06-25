import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { CategoryRoutes } from "../modules/category/category.routes.js";
import { ProductRoutes } from "../modules/product/product.routes.js";
import { AnalyticsRoutes } from "../modules/analytics/analytics.routes.js";
import { UserRoutes } from "../modules/user/user.routes.js";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/categories", route: CategoryRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/analytics", route: AnalyticsRoutes },
  { path: "/users", route: UserRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
