import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
