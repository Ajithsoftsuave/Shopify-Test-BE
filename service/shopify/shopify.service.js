import { ApiVersion } from "@shopify/shopify-api";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import {
  getCartDataByID,
  sendOrderInvoice,
} from "../../service/shopify/query/cart.js";
import Shopify from "shopify-api-node";

export const storefrontClientInit = async (storeDetail) => {
  try {
    const shopifyClient = await createStorefrontApiClient({
      storeDomain: storeDetail.shop_url,
      apiVersion: ApiVersion.July24,
      publicAccessToken: storeDetail.storefront_access_token,
    });
    return shopifyClient;
  } catch (error) {
    throw error;
  }
};

export const shopifyClientInit = async (storeDetail) => {
  try {
    const shopifyClient = await new Shopify({
      shopName: storeDetail.shop_id,
      accessToken: storeDetail.shopify_access_token,
    });

    return shopifyClient;
  } catch (error) {
    throw error;
  }
};

export const fetchCart = async (client, cartID) => {
  const variables = {
    id: cartID, // Pass the cart ID here
  };
  try {
    const { data, errors, extensions } = await client.request(
      getCartDataByID(),
      { variables }
    );
    return data.cart;
  } catch (error) {
    console.error("Errors occurred:", error);
    return error;
  }
};

export const createOrder = async (client, param) => {
  try {
    const order = await client.order.create({
      sendReceipt: true,
      customer: param.customerDetails,
      line_items: param.lineItems,
      billing_address: param.billingAddress,
      shipping_address: param.shippingAddress,
      current_total_price: param.totalAmount,
      current_subtotal_price: param.subtotalAmount,
      current_total_tax: param.totalTaxAmount,
      subtotal_price: param.subtotalAmount,
      transactions: [
        {
          kind: param.paymentDetail.kind,
          status: param.paymentDetail.status,
          amount: param.paymentDetail.amount,
        },
      ],
    });

    if (!order) {
      throw new Error("Order creation failed");
    }
    if (param.paymentDetail.status === "pending") {
      const invoiceParams = {
        orderId: order.admin_graphql_api_id,
        email: {
          to: order.email,
          from: "udhayakumar.devendran@softsuave.com",
          subject: "Your Invoice from Your Shop Name",
          customMessage:
            "Thank you for your order! Please find your invoice attached.",
        },
      };

      const invoiceResponse = await client.graphql(
        sendOrderInvoice(),
        invoiceParams
      );
      console.log("Invoice sent: ", invoiceResponse);
    }

    return order;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
