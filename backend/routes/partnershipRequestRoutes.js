import { Router } from "express";
import mongoose from "mongoose";
import PartnershipRequest from "../models/PartnershipRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import publicSubmissionLimiter from "../middleware/rateLimitMiddleware.js";

const router = Router();
const requestStatuses = ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

// Submit a partnership request without creating an account
router.post("/", publicSubmissionLimiter, async (request, response) => {
  try {
    const partnershipRequest = await PartnershipRequest.create({
      organizationName: request.body?.organizationName,
      contactPhone: request.body?.contactPhone,
      organizationType: request.body?.organizationType,
      partnershipInterest: request.body?.partnershipInterest,
      message: request.body?.message
    });

    return response.status(201).json(partnershipRequest);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return response.status(400).json({ message: "Please provide valid partnership request details" });
    }

    return response.status(500).json({ message: "Failed to submit partnership request" });
  }
});

// Get all partnership requests (admin)
router.get("/", authMiddleware, async (request, response) => {
  try {
    const requests = await PartnershipRequest.find().sort({ createdAt: -1 });
    return response.json(requests);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get partnership requests" });
  }
});

// Get one partnership request (admin)
router.get("/:id", authMiddleware, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid partnership request ID" });
    }

    const partnershipRequest = await PartnershipRequest.findById(request.params.id);

    if (!partnershipRequest) {
      return response.status(404).json({ message: "Partnership request not found" });
    }

    return response.json(partnershipRequest);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get partnership request" });
  }
});

// Update a partnership request's status (admin)
router.put("/:id/status", authMiddleware, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid partnership request ID" });
    }

    if (!requestStatuses.includes(request.body?.status)) {
      return response.status(400).json({ message: "Invalid partnership request status" });
    }

    // The predicate prevents a concurrent update from changing a completed request.
    const partnershipRequest = await PartnershipRequest.findOneAndUpdate(
      { _id: request.params.id, status: { $ne: "COMPLETED" } },
      { $set: { status: request.body.status } },
      { new: true, runValidators: true }
    );

    if (!partnershipRequest) {
      const exists = await PartnershipRequest.exists({ _id: request.params.id });
      if (exists) {
        return response.status(409).json({
          message: "Completed partnership requests are final and their status cannot be changed.",
        });
      }
      return response.status(404).json({ message: "Partnership request not found" });
    }

    return response.json(partnershipRequest);
  } catch (error) {
    return response.status(500).json({ message: "Failed to update partnership request status" });
  }
});

// Delete a partnership request (admin)
router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid partnership request ID" });
    }

    const partnershipRequest = await PartnershipRequest.findByIdAndDelete(request.params.id);

    if (!partnershipRequest) {
      return response.status(404).json({ message: "Partnership request not found" });
    }

    return response.json({ message: "Partnership request deleted successfully" });
  } catch (error) {
    return response.status(500).json({ message: "Failed to delete partnership request" });
  }
});

export default router;
