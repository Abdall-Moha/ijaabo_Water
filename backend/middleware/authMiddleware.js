import jwt from "jsonwebtoken";

function authMiddleware(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Authentication token is required" });
  }

  if (!process.env.JWT_SECRET) {
    return response.status(500).json({ message: "JWT_SECRET is not configured" });
  }

  const token = authorization.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role !== "ADMIN") {
      return response.status(403).json({ message: "Admin access is required" });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authMiddleware;
