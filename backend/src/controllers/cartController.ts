import type { RequestHandler } from "express";

import {
  getUserCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearUserCart,
} from "../services/cartService";

// Get Current User Cart Controller
export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const cart = await getUserCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Add Book To Cart Controller
export const addCartItem: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const { book_id, quantity } = req.body;

    const cartItemId = await addToCart(userId, book_id, quantity);

    res.status(201).json({
      success: true,
      message: "Book added to cart successfully",
      data: {
        cart_item_id: cartItemId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Cart Item Quantity Controller
export const updateCartItem: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const cartItemId = Number(req.params.id);
    const { quantity } = req.body;

    await updateCartQuantity(userId, cartItemId, quantity);

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Remove Cart Item Controller
export const removeCartItem: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    const cartItemId = Number(req.params.id);

    await removeFromCart(userId, cartItemId);

    res.status(200).json({
      success: true,
      message: "Book removed from cart successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Clear Current User Cart Controller
export const clearCart: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    await clearUserCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};
