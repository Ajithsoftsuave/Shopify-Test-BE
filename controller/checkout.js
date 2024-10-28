import { ShopifyStore } from "../db/model/store.js";
import {
  createOrder,
  fetchCart,
  shopifyClientInit,
  storefrontClientInit,
  applyDiscountService,
  applyShippingAddress,
} from "../service/shopify/shopify.service.js";

export const getCartController = async (req, res) => {
  try {
    const data = await ShopifyStore.findOne({
      where: {
        shop_id: req.query.shopID,
      },
    });
    if (!data) {
      res.status(404).send("Shopify store not found");
    }
    const storefrontClient = await storefrontClientInit(data);
    console.log(storefrontClient);
    let cart = await fetchCart(storefrontClient, req.query.cartID);

    res.send({ data: cart });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const createOrderController = async (req, res) => {
  try {
    const data = await ShopifyStore.findOne({
      where: {
        shop_id: req.body.shopID,
      },
    });
    if (!data) {
      res.status(404).send("Shopify store not found");
    }
    const storefrontClient = await storefrontClientInit(data);
    let cart = await fetchCart(storefrontClient, req.body.cartID);
    const shopifyClient = await shopifyClientInit(data);
    let orderParam = {};
    orderParam.lineItems = cart.lines.edges.map((data) => {
      const variantSplit = data.node.merchandise.id.split("/");
      return {
        variant_id: variantSplit[variantSplit.length - 1],
        quantity: data.node.quantity,
      };
    });
    cart.discountAllocations.forEach((discount) => {
      orderParam.discountAmount = (
        parseFloat(orderParam.discountAmount) +
        parseFloat(discount.discountedAmount.amount)
      ).toFixed(2);
    });
    orderParam.totalAmount = cart.cost.totalAmount.amount;
    orderParam.subtotalAmount = cart.cost.subtotalAmount.amount;
    orderParam.totalTaxAmount = cart.cost.totalTaxAmount;
    orderParam.shippingAddress = req.body.shippingAddress;
    orderParam.billingAddress = req.body.billingAddress;
    orderParam.customerDetails = req.body.customerDetails;
    orderParam.paymentDetail = req.body.paymentDetail;
    const result = await createOrder(shopifyClient, orderParam);
    res.send({ data: result });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const applyDiscountController = async (req, res) => {
  try {
    const data = await ShopifyStore.findOne({
      where: {
        shop_id: req.query.shopID,
      },
    });
    if (!data) {
      res.status(404).send("Shopify store not found");
    }
    const storefrontClient = await storefrontClientInit(data);
    let discountCode = req.query?.discountCode?.replace("%3F", "?");
    discountCode = req.query?.discountCode?.replace("%3D", "=");
    const requestParams = {
      cartId: req.query.cartID,
      discountCodes: [discountCode],
    };
    let updatedCart = await applyDiscountService(
      storefrontClient,
      requestParams
    );

    res.send({ data: updatedCart });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const applyShppingRequest = async (req, res) => {
  try {
    const data = await ShopifyStore.findOne({
      where: {
        shop_id: req.query.shopID,
      },
    });
    if (!data) {
      res.status(404).send("Shopify store not found");
    }
    const storefrontClient = await storefrontClientInit(data);
    const requestParams = {
      checkoutId: "gid://shopify/Checkout/1234567890",
      shippingAddress: req.body.shippingAddress,
    };
    let updatedCart = await applyShippingAddress(
      storefrontClient,
      requestParams
    );

    res.send({ data: updatedCart });
  } catch (error) {
    res.status(500).send(error);
  }
};
