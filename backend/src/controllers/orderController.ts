import type { RequestHandler } from "express";

import {
  checkout,
  getUserOrders,
  getUserOrderDetails,
  getOrderByNumber,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/orderService";

import type { CheckoutInput } from "../services/orderService";

import type { OrderStatus, PaymentStatus } from "../models/orderModel";
