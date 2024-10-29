import { ApiVersion } from "@shopify/shopify-api";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import {
  getCartDataByID,
  sendOrderInvoice,
  applyDiscount,
} from "../../service/shopify/query/cart.js";
import Shopify from "shopify-api-node";

export const storefrontClientInit = async (storeDetail) => {
  try {
    const storefrontClient = await createStorefrontApiClient({
      storeDomain: storeDetail.shop_url,
      apiVersion: ApiVersion.April24,
      publicAccessToken: storeDetail.storefront_access_token,
    });
    return storefrontClient;
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
      send_receipt: true,
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
          from: "ajithkumar.palani@softsuave.com",
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

export const applyDiscountService = async (client, params) => {
  try {
    const variables = {
      cartId: params.cartId,
      discountCodes: params.discountCodes,
    };
    const cartResponse = await client.request(
      `mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      discountCodes {
        applicable
        code
      }
    }
    userErrors {
      field
      message
    }
  }
}`,
      {
        variables,
      }
    );
    return cartResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCheckoutService = async (client, input) => {
  try {
    // Ensure input is in the correct JSON format with required fields
    const requestParams = {
      input: {
        lineItems: input.lineItems,
        shippingAddress: {
          address1: input.shippingAddress.address1,
          city: input.shippingAddress.city,
          province: input.shippingAddress.province,
          country: input.shippingAddress.country,
          zip: input.shippingAddress.zip,
          firstName: input.shippingAddress.firstName,
          lastName: input.shippingAddress.lastName,
        },
        email: input.email,
      },
    };

    const cartResponse = await client.request(
      `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      requestParams
    );
    return cartResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const applyShippingAddressService = async (client, params) => {
  try {
    const requestParams = {
      checkoutId: params.checkoutId,
      shippingAddress: params.shippingAddress,
    };

    const cartResponse = await client.request(
      `mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
  checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
    checkout {
      id
      shippingAddress {
        address1
        address2
        city
        province
        country
        zip
      }
      shippingLine {
        title
        priceV2 {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`,
      requestParams
    );
    return cartResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
