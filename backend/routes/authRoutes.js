import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Admin login
router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body || {};

    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

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

// Create the first Admin
// This only works when there is no Admin account yet.
router.post("/create-first-admin", async (request, response) => {
  try {
    const { name, email, password } = request.body || {};

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return response.status(403).json({
        message: "An admin already exists"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return response.status(409).json({
        message: "A user with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    return response.status(201).json({
      message: "First admin created successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to create first admin"
    });
  }
});

// Create another Admin
// Authentication is required.
router.post("/create-admin", authMiddleware, async (request, response) => {
  try {
    const { name, email, password } = request.body || {};

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (request.user.role !== "admin") {
      return response.status(403).json({
        message: "Only an admin can create another admin"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return response.status(409).json({
        message: "A user with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    return response.status(201).json({
      message: "Admin created successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to create admin"
    });
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

// Activate or deactivate another Admin
router.put("/admin/:id/status", authMiddleware, async (request, response) => {
  try {
    const { id } = request.params;
    const { isActive } = request.body || {};

    if (request.user.role !== "admin") {
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
      role: "admin"
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