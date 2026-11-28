import {
  findOrdersByUserId,
  findOrderById,
  findOrderByNumber,
  findAllOrdersForAdmin,
  updateOrderStatus as updateOrderStatusModel,
  updatePaymentStatus as updatePaymentStatusModel,
} from "../models/orderModel";

import { findOrderItems } from "../models/orderItemModel";

import { randomUUID } from "node:crypto";

import { withTransaction } from "../utils/db";

import { findCartByUserId } from "../models/cartModel";

import { findCartItems, clearCart } from "../models/cartItemModel";

import { decreaseBookStock } from "../models/bookModel";

import { createOrder } from "../models/orderModel";

import type { PaymentMethod } from "../models/orderModel";

import { createOrderItem } from "../models/orderItemModel";
import { handleDatabaseError } from "../utils/databaseError";

import type { Order, OrderStatus, PaymentStatus } from "../models/orderModel";

import type { OrderItem } from "../models/orderItemModel";

export interface CheckoutInput {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  payment_method: PaymentMethod;
}

function validateCheckoutInput(input: CheckoutInput): void {
  const shippingName = input.shipping_name?.trim();
  const shippingPhone = input.shipping_phone?.trim();
  const shippingAddress = input.shipping_address?.trim();

  if (!shippingName || !shippingPhone || !shippingAddress) {
    throw new Error("Shipping information is required");
  }

  if (shippingName.length > 150) {
    throw new Error("Shipping name must not exceed 150 characters");
  }

  if (shippingPhone.length > 30) {
    throw new Error("Shipping phone must not exceed 30 characters");
  }

  const validPaymentMethods: PaymentMethod[] = [
    "cash_on_delivery",
    "bank_transfer",
  ];

  if (!validPaymentMethods.includes(input.payment_method)) {
    throw new Error("Invalid payment method");
  }
}

// Get User Orders

export async function getUserOrders(userId: number): Promise<Order[]> {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  try {
    return await findOrdersByUserId(userId);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Get All Orders For Admin
export async function getAllOrdersForAdmin(): Promise<Order[]> {
  try {
    return await findAllOrdersForAdmin();
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Get User Order Details

export async function getUserOrderDetails(
  userId: number,
  orderId: number,
): Promise<{
  order: Order;
  items: OrderItem[];
}> {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID");
  }

  try {
    const order = await findOrderById(orderId);

    if (!order || order.user_id !== userId) {
      throw new Error("Order not found");
    }

    const items = await findOrderItems(orderId);

    return {
      order,
      items,
    };
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Get Order By Number

export async function getOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  const trimmedOrderNumber = orderNumber.trim();

  if (!trimmedOrderNumber) {
    throw new Error("Order number is required");
  }

  try {
    return await findOrderByNumber(trimmedOrderNumber);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Get Order Details For Admin
export async function getAdminOrderDetails(orderId: number): Promise<{
  order: Order;
  items: OrderItem[];
}> {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID");
  }

  try {
    const order = await findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const items = await findOrderItems(orderId);

    return {
      order,
      items,
    };
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Update Order Status
export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<boolean> {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID");
  }

  const validStatuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  try {
    const order = await findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return await updateOrderStatusModel(orderId, status);
  } catch (error) {
    handleDatabaseError(error);
  }
}

// Update Payment Status

export async function updatePaymentStatus(
  orderId: number,
  status: PaymentStatus,
): Promise<boolean> {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID");
  }

  const validStatuses: PaymentStatus[] = [
    "pending",
    "paid",
    "failed",
    "refunded",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid payment status");
  }

  try {
    const order = await findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return await updatePaymentStatusModel(orderId, status);
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function checkout(userId: number, input: CheckoutInput) {
  // 1. Validate User ID
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }

  // 2. Validate Checkout Input
  validateCheckoutInput(input);

  try {
    // 3. Start Database Transaction
    return await withTransaction(async (connection) => {
      // Find and lock user's cart
      const cart = await findCartByUserId(userId, connection, true);

      if (!cart) {
        throw new Error("Cart not found");
      }

      // Find and lock cart items
      const cartItems = await findCartItems(cart.id, connection, true);

      if (cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }

      // Calculate subtotal using cents
      let subtotalCents = 0;

      for (const item of cartItems) {
        if (!item.is_active) {
          throw new Error(`${item.title} is no longer available`);
        }

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error(`Invalid quantity for ${item.title}`);
        }

        if (item.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.title}`);
        }

        const price = Number(item.price);

        if (!Number.isFinite(price) || price < 0) {
          throw new Error(`Invalid price for ${item.title}`);
        }

        const unitPriceCents = Math.round(price * 100);

        subtotalCents += unitPriceCents * item.quantity;

        if (!Number.isSafeInteger(subtotalCents)) {
          throw new Error("Order amount is too large");
        }
      }

      const subtotal = subtotalCents / 100;

      // Decrease book stock
      for (const item of cartItems) {
        const stockUpdated = await decreaseBookStock(
          item.book_id,
          item.quantity,
          connection,
        );

        if (!stockUpdated) {
          throw new Error(`Insufficient stock for ${item.title}`);
        }
      }

      // Calculate shipping fee
      const shippingFee = 0;

      // Calculate total amount
      const totalAmount = subtotal + shippingFee;

      // Generate unique order number
      const orderNumber = `ORD-${randomUUID()}`;

      // Create order record
      const orderId = await createOrder(
        {
          user_id: userId,
          order_number: orderNumber,
          subtotal,
          shipping_fee: shippingFee,
          total_amount: totalAmount,
          payment_method: input.payment_method,
          shipping_name: input.shipping_name.trim(),
          shipping_phone: input.shipping_phone.trim(),
          shipping_address: input.shipping_address.trim(),
        },
        connection,
      );

      // Create order items
      for (const item of cartItems) {
        const unitPrice = Math.round(Number(item.price) * 100) / 100;

        await createOrderItem(
          {
            order_id: orderId,
            book_id: item.book_id,
            book_title: item.title,
            author: item.author,
            unit_price: unitPrice,
            quantity: item.quantity,
          },
          connection,
        );
      }

      // Clear user's cart
      await clearCart(cart.id, connection);

      // Return order summary
      return {
        order_id: orderId,
        order_number: orderNumber,
        subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        payment_method: input.payment_method,
      };
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}
