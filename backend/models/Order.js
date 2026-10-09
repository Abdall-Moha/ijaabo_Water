import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    customerType: {
      type: String,
      required: true,
      enum: [
        "Household",
        "Shop",
        "Supermarket",
        "Hotel",
        "Restaurant",
        "School",
        "University",
        "NGO",
        "Government Office",
        "Corporate Client",
        "Event",
        "Other",
      ],
    },

    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },

          productName: {
            type: String,
            required: true,
            trim: true,
          },

          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      validate: {
        validator: (products) => products.length > 0,
        message: "An order must contain at least one product.",
      },
    },

    deliveryLocation: {
      type: String,
      required: true,
      trim: true,
    },

    additionalNotes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PROCESSING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
