import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {

    let token = req.cookies?.token;
    const header = req.headers.authorization;
    if (!token && header?.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User no longer exists" });
    }
    
    req.user = user; 
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;