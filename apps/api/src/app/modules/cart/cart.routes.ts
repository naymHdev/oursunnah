import { Router } from "express";
import auth from "../../middleware/auth.js";
import { CartController } from "./cart.controller.js";

const router = Router();

router.use(auth());

router.get("/", CartController.getCart);
router.post("/items", CartController.addItem);
router.patch("/items/:itemId", CartController.updateItem);
router.delete("/items/:itemId", CartController.removeItem);
router.delete("/", CartController.clearCart);

// Called once, right after login, to fold the guest (localStorage) cart
// into the now-authenticated user's server cart.
router.post("/merge", CartController.mergeCart);

export const CartRoutes = router;
