import { Router } from "express";
import mongoose from "mongoose";
import Partner from "../models/Partner.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadPartnerLogo } from "../middleware/uploadMiddleware.js";

const router = Router();

// Admin view includes inactive partners for editing and publishing.
router.get("/admin", authMiddleware, async (request, response) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    return response.json(partners);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get partners" });
  }
});

// Get active partners for the public website
router.get("/", async (request, response) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ createdAt: 1 });
    return response.json(partners);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get partners" });
  }
});

// Create a partner
router.post("/", authMiddleware, uploadPartnerLogo.single("logo"), async (request, response) => {
  try {
    const body = request.body || {};
    const partner = await Partner.create({
      name: body.name,
      logo: request.file ? `/uploads/PartnerLogo/${request.file.filename}` : body.logo,
      website: body.website,
      isActive: body.isActive
    });

    return response.status(201).json(partner);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return response.status(400).json({ message: "Invalid partner data" });
    }

    return response.status(500).json({ message: "Failed to create partner" });
  }
});

// Update a partner
router.put("/:id", authMiddleware, uploadPartnerLogo.single("logo"), async (request, response) => {
  try {
    const body = request.body || {};

    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid partner ID" });
    }

    const updates = {
      name: body.name,
      website: body.website,
      isActive: body.isActive
    };

    if (request.file) {
      updates.logo = `/uploads/PartnerLogo/${request.file.filename}`;
    } else if (body.logo !== undefined) {
      updates.logo = body.logo;
    }

    for (const key of Object.keys(updates)) {
      if (updates[key] === undefined) delete updates[key];
    }

    const partner = await Partner.findByIdAndUpdate(request.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!partner) {
      return response.status(404).json({ message: "Partner not found" });
    }

    return response.json(partner);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return response.status(400).json({ message: "Invalid partner data" });
    }

    return response.status(500).json({ message: "Failed to update partner" });
  }
});

// Delete a partner
router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid partner ID" });
    }

    const partner = await Partner.findByIdAndDelete(request.params.id);

    if (!partner) {
      return response.status(404).json({ message: "Partner not found" });
    }

    return response.json({ message: "Partner deleted successfully" });
  } catch (error) {
    return response.status(500).json({ message: "Failed to delete partner" });
  }
});

export default router;
