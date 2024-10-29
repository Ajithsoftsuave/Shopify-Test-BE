import express from "express";
import {
  createOrderController,
  getCartController,
  applyDiscountController,
} from "../controller/checkout.js";
import { applyShippingAddress } from "../service/shopify/shopify.service.js";

const router = express.Router();

router.get("/cart", getCartController);
router.get("/cart/apply-discount", applyDiscountController);

router.post("/order/create", createOrderController);
router.post("/cart/update-shipping", applyShippingAddress);

export default router;
