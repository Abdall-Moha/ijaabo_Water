import mongoose from "mongoose";

const partnershipRequestSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  organizationType: {
    type: String,
    required: true,
    enum: [
      "Development Partner / INGO",
      "Government Institution",
      "NGO / Community Organization",
      "Hotel / Restaurant",
      "School / University",
      "Private Business",
      "Corporate Client",
      "Event Organizer",
      "Other"
    ]
  },
  partnershipInterest: {
    type: String,
    required: true,
    enum: [
      "Bulk Water Supply Contract",
      "Community Water Program",
      "WASH Program Supply",
      "Retail Distribution Partnership",
      "Investment / Development Partnership",
      "Other"
    ]
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    default: "NEW"
  }
}, {
  timestamps: true
});

const PartnershipRequest = mongoose.model("PartnershipRequest", partnershipRequestSchema);

export default PartnershipRequest;
