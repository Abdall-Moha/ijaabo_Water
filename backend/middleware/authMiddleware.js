import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function authMiddleware(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Authentication token is required" });
  }

  if (!process.env.JWT_SECRET) {
    return response.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  const token = authorization.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return response.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findById(decoded.id).select("name email role isActive");
    if (!user || !user.isActive) {
      return response.status(401).json({ message: "Admin account is unavailable" });
    }

    if (user.role !== "ADMIN") {
      return response.status(403).json({ message: "Admin access is required" });
    }

    request.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    return response.status(500).json({ message: "Could not verify admin account" });
  }
}

export default authMiddleware;
