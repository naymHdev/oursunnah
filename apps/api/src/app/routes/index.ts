import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { CategoryRoutes } from "../modules/category/category.routes.js";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/categories", route: CategoryRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
