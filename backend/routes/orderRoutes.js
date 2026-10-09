import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import publicSubmissionLimiter from "../middleware/rateLimitMiddleware.js";

const router = Router();

// Customer submits an order
router.post("/", publicSubmissionLimiter, async (request, response) => {
  try {
    const {
      fullName,
      phone,
      customerType,
      products,
      deliveryLocation,
      additionalNotes,
    } = request.body;

    if (!fullName || !phone || !customerType || !deliveryLocation) {
      return response.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    if (!products || products.length === 0) {
      return response.status(400).json({
        message: "Please select at least one product",
      });
    }

    const orderProducts = [];

    // Get product names from the database
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return response.status(400).json({
          message: "Product not found or is inactive",
        });
      }

      orderProducts.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      fullName,
      phone,
      customerType,
      products: orderProducts,
      deliveryLocation,
      additionalNotes,
    });

    response.status(201).json({
      message: "Order submitted successfully",
      order,
    });
  } catch (error) {
    response.status(500).json({
      message: "Failed to submit order",
    });
  }
});

// Admin gets all orders
router.get("/", authMiddleware, async (request, response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    response.json(orders);
  } catch (error) {
    response.status(500).json({
      message: "Failed to get orders",
    });
  }
});

// Admin gets one order
router.get("/:id", authMiddleware, async (request, response) => {
  try {
    const order = await Order.findById(request.params.id);

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
      });
    }

    response.json(order);
  } catch (error) {
    response.status(500).json({
      message: "Failed to get order",
    });
  }
});

// Admin updates order status
router.put("/:id/status", authMiddleware, async (request, response) => {
  try {
    const { status } = request.body;

    const order = await Order.findByIdAndUpdate(
      request.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
      });
    }

    response.json(order);
  } catch (error) {
    response.status(500).json({
      message: "Failed to update order status",
    });
  }
});

// Admin deletes an order
router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const order = await Order.findByIdAndDelete(request.params.id);

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
      });
    }

    response.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    response.status(500).json({
      message: "Failed to delete order",
    });
  }
});

export default router;