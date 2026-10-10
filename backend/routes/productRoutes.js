import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadProductImage } from "../middleware/uploadMiddleware.js";

const router = Router();

// Admin product management includes unpublished products.
router.get("/admin", authMiddleware, async (request, response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return response.json(products);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get products" });
  }
});

// Get active products for the public website
router.get("/", async (request, response) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: 1 });
    return response.json(products);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get products" });
  }
});

// Create a product
router.post("/", authMiddleware, uploadProductImage.single("image"), async (request, response) => {
  try {
    const body = request.body || {};
    const product = await Product.create({
      name: body.name,
      size: body.size,
      image: request.file ? `/uploads/products/${request.file.filename}` : body.image,
      description: body.description,
      isActive: body.isActive
    });

    return response.status(201).json(product);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return response.status(400).json({ message: "Invalid product data" });
    }

    return response.status(500).json({ message: "Failed to create product" });
  }
});

// Update a product
router.put("/:id", authMiddleware, uploadProductImage.single("image"), async (request, response) => {
  try {
    const body = request.body || {};

    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid product ID" });
    }

    const updates = {
      name: body.name,
      size: body.size,
      description: body.description,
      isActive: body.isActive
    };

    if (request.file) {
      updates.image = `/uploads/products/${request.file.filename}`;
    } else if (body.image !== undefined) {
      updates.image = body.image;
    }

    for (const key of Object.keys(updates)) {
      if (updates[key] === undefined) delete updates[key];
    }

    const product = await Product.findByIdAndUpdate(request.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }

    return response.json(product);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return response.status(400).json({ message: "Invalid product data" });
    }

    return response.status(500).json({ message: "Failed to update product" });
  }
});

// Delete a product
router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(request.params.id);

    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }

    return response.json({ message: "Product deleted successfully" });
  } catch (error) {
    return response.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
