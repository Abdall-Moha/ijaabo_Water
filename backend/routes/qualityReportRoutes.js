import { Router } from "express";
import mongoose from "mongoose";
import QualityReport from "../models/QualityReport.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadReportPdf } from "../middleware/uploadMiddleware.js";

const router = Router();

// Admin report list is protected. The public root list remains for published site documents.
router.get("/admin", authMiddleware, async (request, response) => {
  try {
    const reports = await QualityReport.find().sort({ reportDate: -1 });
    return response.json(reports);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get quality reports" });
  }
});

// Get all quality reports
router.get("/", async (request, response) => {
  try {
    const reports = await QualityReport.find().sort({ reportDate: -1 });
    return response.json(reports);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get quality reports" });
  }
});

// Get one quality report
router.get("/:id", async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid quality report ID" });
    }

    const report = await QualityReport.findById(request.params.id);

    if (!report) {
      return response.status(404).json({ message: "Quality report not found" });
    }

    return response.json(report);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get quality report" });
  }
});

// Create a quality report with its PDF file
router.post("/", authMiddleware, uploadReportPdf.single("pdf"), async (request, response) => {
  try {
    const body = request.body || {};

    if (!request.file) {
      return response.status(400).json({ message: "A PDF file is required" });
    }

    const report = await QualityReport.create({
      title: body.title,
      reportDate: body.reportDate,
      status: body.status,
      pdf: `/uploads/ReportPdf/${request.file.filename}`
    });

    return response.status(201).json(report);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return response.status(400).json({ message: "Invalid quality report data" });
    }

    return response.status(500).json({ message: "Failed to create quality report" });
  }
});

// Update a quality report
router.put("/:id", authMiddleware, uploadReportPdf.single("pdf"), async (request, response) => {
  try {
    const body = request.body || {};

    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid quality report ID" });
    }

    const updates = {
      title: body.title,
      reportDate: body.reportDate,
      status: body.status
    };

    if (request.file) {
      updates.pdf = `/uploads/ReportPdf/${request.file.filename}`;
    }

    for (const key of Object.keys(updates)) {
      if (updates[key] === undefined) delete updates[key];
    }

    const report = await QualityReport.findByIdAndUpdate(request.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!report) {
      return response.status(404).json({ message: "Quality report not found" });
    }

    return response.json(report);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return response.status(400).json({ message: "Invalid quality report data" });
    }

    return response.status(500).json({ message: "Failed to update quality report" });
  }
});

// Delete a quality report
router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ message: "Invalid quality report ID" });
    }

    const report = await QualityReport.findByIdAndDelete(request.params.id);

    if (!report) {
      return response.status(404).json({ message: "Quality report not found" });
    }

    return response.json({ message: "Quality report deleted successfully" });
  } catch (error) {
    return response.status(500).json({ message: "Failed to delete quality report" });
  }
});

export default router;
