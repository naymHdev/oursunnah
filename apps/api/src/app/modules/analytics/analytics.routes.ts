import { Router } from "express";
import auth from "../../middleware/auth.js";
import { AnalyticsController } from "./analytics.controller.js";

const router = Router();

router.get("/me/interests", auth(), AnalyticsController.getMyInterests);

export const AnalyticsRoutes = router;
