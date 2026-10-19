
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { adminLoginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = Router();

// Check whether an email address is valid
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check whether a password is valid for bcrypt
function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    Buffer.byteLength(password, "utf8") <= 72
  );
}

// Register the first admin only when the User collection is empty
router.post("/register-first-admin", adminLoginLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // Check whether any user already exists
    const userExists = await User.exists({});

    if (userExists) {
      return res.status(403).json({
        message: "Registration is closed because a user already exists"
      });
    }

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !isValidEmail(email.trim()) ||
      !isValidPassword(password)
    ) {
      return res.status(400).json({
        message: "Provide a name, valid email, and password of 8 to 72 bytes"
      });
    }

    const admin = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role: "ADMIN",
      isActive: true
    });

    return res.status(201).json({
      message: "First admin registered successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered"
      });
    }

    return res.status(500).json({
      message: "Failed to register first admin"
    });
  }
});

// Admin login
router.post("/login", adminLoginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      role: "ADMIN"
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "This admin account is inactive"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured"
      });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to log in"
    });
  }
});

// Get the logged-in admin's profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email role isActive");

    if (!user) {
      return res.status(404).json({
        message: "Admin user not found"
      });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get admin profile"
    });
  }
});

// Change the logged-in admin's password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (
      typeof currentPassword !== "string" ||
      !currentPassword ||
      !isValidPassword(newPassword)
    ) {
      return res.status(400).json({
        message: "Provide your current password and a valid new password"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Admin user not found"
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({
      message: "Password changed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to change password"
    });
  }
});

// Get all admins
router.get("/admins", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can view admin users"
      });
    }

    const admins = await User.find({ role: "ADMIN" })
      .select("name email role isActive createdAt")
      .sort({ createdAt: 1 });

    return res.json(admins);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get admin users"
    });
  }
});

// Create another admin
router.post("/admins", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can create admin users"
      });
    }

    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !isValidEmail(email.trim()) ||
      !isValidPassword(password)
    ) {
      return res.status(400).json({
        message: "Provide a name, valid email, and password of 8 to 72 bytes"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({
        message: "This email is already registered"
      });
    }

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: "ADMIN",
      isActive: true
    });

    return res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered"
      });
    }

    return res.status(500).json({
      message: "Failed to create admin"
    });
  }
});

// Update another admin
router.put("/admins/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can update admin users"
      });
    }

    const { id } = req.params;
    const { name, email, password } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid admin ID"
      });
    }

    if (id === req.user.id) {
      return res.status(400).json({
        message: "Use Settings to update your own account"
      });
    }

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !isValidEmail(email.trim())
    ) {
      return res.status(400).json({
        message: "Provide a valid name and email"
      });
    }

    if (password !== undefined && password !== "" && !isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be between 8 and 72 bytes"
      });
    }

    const admin = await User.findOne({
      _id: id,
      role: "ADMIN"
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const duplicate = await User.exists({
      email: normalizedEmail,
      _id: { $ne: admin._id }
    });

    if (duplicate) {
      return res.status(409).json({
        message: "This email is already registered"
      });
    }

    admin.name = name.trim();
    admin.email = normalizedEmail;

    if (password) {
      admin.password = await bcrypt.hash(password, 12);
    }

    await admin.save();

    return res.json({
      message: "Admin updated successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered"
      });
    }

    return res.status(500).json({
      message: "Failed to update admin"
    });
  }
});

// Activate or deactivate another admin
router.put("/admin/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admins can change admin status"
      });
    }

    const { id } = req.params;
    const { isActive } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid admin ID"
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false"
      });
    }

    if (id === req.user.id) {
      return res.status(400).json({
        message: "You cannot change your own admin status"
      });
    }

    const admin = await User.findOne({
      _id: id,
      role: "ADMIN"
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    admin.isActive = isActive;
    await admin.save();

    return res.json({
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
    return res.status(500).json({
      message: "Failed to update admin status"
    });
  }
});

export default router;
