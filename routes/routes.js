import express from "express";
import {
  createOrderController,
  getCartController,
  applyDiscountController,
  applyShippingRequest,
} from "../controller/checkout.js";

const router = express.Router();

router.get("/cart", getCartController);
router.get("/cart/apply-discount", applyDiscountController);

router.post("/order/create", createOrderController);
router.post("/cart/update-shipping", applyShippingRequest);

export default router;
