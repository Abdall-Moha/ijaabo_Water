import mongoose from "mongoose";

const qualityReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    reportDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PASSED", "FAILED"],
      default: "PASSED",
    },

    pdf: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QualityReport = mongoose.model("QualityReport", qualityReportSchema);

export default QualityReport;