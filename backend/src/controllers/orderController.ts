import type { RequestHandler } from "express";

import {
  checkout,
  getUserOrders,
  getUserOrderDetails,
  getOrderByNumber,
  getAllOrdersForAdmin,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/orderService";

import type { CheckoutInput } from "../services/orderService";

import type { OrderStatus, PaymentStatus } from "../models/orderModel";

// Checkout Controller
export const createCheckout: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const input: CheckoutInput = {
      shipping_name: req.body.shipping_name,
      shipping_phone: req.body.shipping_phone,
      shipping_address: req.body.shipping_address,
      payment_method: req.body.payment_method,
    };

    const order = await checkout(userId, input);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User Orders Controller
export const getMyOrders: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const orders = await getUserOrders(userId);

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Orders For Admin Controller
export const getAllOrdersForAdminController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const orders = await getAllOrdersForAdmin();

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User Order Details Controller
export const getMyOrderDetails: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const orderId = Number(req.params.id);

    const order = await getUserOrderDetails(userId, orderId);

    res.status(200).json({
      success: true,
      message: "Order details retrieved successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get Order By Number Controller
export const getOrderByNumberController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const orderNumber = String(req.params.orderNumber);

    const order = await getOrderByNumber(orderNumber);

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status Controller
export const editOrderStatus: RequestHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    const status: OrderStatus = req.body.status;

    await updateOrderStatus(orderId, status);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Payment Status Controller
export const editPaymentStatus: RequestHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    const status: PaymentStatus = req.body.status;

    await updatePaymentStatus(orderId, status);

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
