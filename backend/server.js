import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import partnershipRequestRoutes from "./routes/partnershipRequestRoutes.js";
import qualityReportRoutes from "./routes/qualityReportRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/partnership-requests", partnershipRequestRoutes);
app.use("/api/quality-reports", qualityReportRoutes);
app.use("/api/partners", partnerRoutes);

// Return upload and request parsing errors as JSON
app.use((error, request, response, next) => {
  const isUploadError = error.name === "MulterError" || error.message.startsWith("Only ");
  const statusCode = isUploadError ? 400 : error.status || 500;
  const message = statusCode < 500 ? error.message : "Server error";

  return response.status(statusCode).json({ message });
});

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to the backend .env file.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing. Add it to the backend .env file.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error.message);
  process.exit(1);
});
