import { Router } from "express";
import { NewsletterController } from "./newsletter.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import {
  subscribeNewsletterSchema,
  unsubscribeNewsletterSchema,
} from "@our-sunnah/validation";

const router = Router();

// Public — works for guests; optionalAuth() attaches userId only if a
// valid token is present, it never blocks the request.
router.post(
  "/subscribe",
  optionalAuth(),
  validateRequest(subscribeNewsletterSchema),
  NewsletterController.subscribe
);

router.post(
  "/unsubscribe",
  validateRequest(unsubscribeNewsletterSchema),
  NewsletterController.unsubscribe
);

export const NewsletterRoutes = router;
