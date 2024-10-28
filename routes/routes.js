import express from "express";
import {
  createOrderController,
  getCartController,
  applyDiscountController,
} from "../controller/checkout.js";

const router = express.Router();

router.get("/cart", getCartController);
router.get("/cart/apply-discount", applyDiscountController);

router.post("/order/create", createOrderController);

export default router;
