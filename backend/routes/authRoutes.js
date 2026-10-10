import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminLoginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = Router();

// Admin login
router.post("/login", adminLoginLimiter, async (request, response) => {
  try {
    const { email, password } = request.body || {};

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return response.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase(), role: "ADMIN" });

    if (!user) {
      return response.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return response.status(403).json({ message: "This admin account is inactive" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return response.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      return response.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return response.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return response.status(500).json({ message: "Failed to log in" });
  }
});
// Return the current database-backed admin identity for protected frontend routes.
router.get("/me", authMiddleware, async (request, response) => {
  try {
    const user = await User.findById(request.user.id).select("name email role isActive");
    return response.json({ user });
  } catch (error) {
    return response.status(500).json({ message: "Failed to get admin profile" });
  }
});

// Change the authenticated admin's password
router.put("/change-password", authMiddleware, async (request, response) => {
  try {
    const { currentPassword, newPassword } = request.body || {};

    if (!currentPassword || !newPassword) {
      return response.status(400).json({
        message: "Current and new passwords are required"
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8 || Buffer.byteLength(newPassword, "utf8") > 72) {
      return response.status(400).json({ message: "The new password must be 8 to 72 bytes" });
    }

    const user = await User.findById(request.user.id);

    if (!user) {
      return response.status(404).json({
        message: "Admin user not found"
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return response.status(400).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return response.json({
      message: "Password changed successfully"
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to change password"
    });
  }
});

// Admin user management
router.get("/admins", authMiddleware, async (request, response) => {
  try {
    const admins = await User.find({ role: "ADMIN" })
      .select("name email role isActive createdAt")
      .sort({ createdAt: 1 });
    return response.json(admins);
  } catch (error) {
    return response.status(500).json({ message: "Failed to get admin users" });
  }
});

router.post("/admins", authMiddleware, async (request, response) => {
  try {
    const { name, email, password } = request.body || {};
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" || password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return response.status(400).json({ message: "Provide a name, valid email, and password between 8 and 72 bytes" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return response.status(409).json({ message: "A user with this email already exists" });
    }

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: "ADMIN",
      isActive: true,
    });
    return response.status(201).json({
      message: "Admin created successfully",
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, isActive: admin.isActive },
    });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: "A user with this email already exists" });
    return response.status(500).json({ message: "Failed to create admin" });
  }
});

router.put("/admins/:id", authMiddleware, async (request, response) => {
  try {
    const { id } = request.params;
    const { name, email, password } = request.body || {};
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: "Invalid admin ID" });
    }
    if (id === request.user.id) {
      return response.status(400).json({ message: "Use Settings to update your own account" });
    }
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return response.status(400).json({ message: "Name and email are required" });
    }
    if (password !== undefined && (typeof password !== "string" || (password && (password.length < 8 || Buffer.byteLength(password, "utf8") > 72)))) {
      return response.status(400).json({ message: "A new password must be between 8 and 72 bytes" });
    }

    const admin = await User.findOne({ _id: id, role: "ADMIN" });
    if (!admin) return response.status(404).json({ message: "Admin not found" });

    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = await User.exists({ email: normalizedEmail, _id: { $ne: admin._id } });
    if (duplicate) return response.status(409).json({ message: "A user with this email already exists" });

    admin.name = name.trim();
    admin.email = normalizedEmail;
    if (password) admin.password = await bcrypt.hash(password, 12);
    await admin.save();
    return response.json({
      message: "Admin updated successfully",
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, isActive: admin.isActive },
    });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: "A user with this email already exists" });
    return response.status(500).json({ message: "Failed to update admin" });
  }
});

// Activate or deactivate another Admin
router.put("/admin/:id/status", authMiddleware, async (request, response) => {
  try {
    const { id } = request.params;
    const { isActive } = request.body || {};

    if (request.user.role !== "ADMIN") {
      return response.status(403).json({
        message: "Only an admin can change another admin's status"
      });
    }

    if (typeof isActive !== "boolean") {
      return response.status(400).json({
        message: "isActive must be true or false"
      });
    }

    const admin = await User.findOne({
      _id: id,
      role: "ADMIN"
    });

    if (!admin) {
      return response.status(404).json({
        message: "Admin not found"
      });
    }

    // Prevent an admin from deactivating their own account
    if (admin._id.toString() === request.user.id.toString()) {
      return response.status(400).json({
        message: "You cannot change your own admin status"
      });
    }

    admin.isActive = isActive;
    await admin.save();

    return response.json({
      message: isActive
        ? "Admin activated successfully"
        : "Admin deactivated successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to update admin status"
    });
  }
});
export default router;
