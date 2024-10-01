import express from 'express';
import { createOrderController, getCartController } from '../controller/checkout.js';

const router = express.Router();

router.get('/cart', getCartController)
router.post('/order/create', createOrderController)

export default router;