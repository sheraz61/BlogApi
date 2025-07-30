import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js'; // Import User model

dotenv.config({ path: '../.env' });

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request. Please login.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.jwt_Secret);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
        success: false,
      });
    }

    const user = await User.findById(decoded.id).select("-password -resetPassword -emailVerification");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user; // ✅ Full user object including role
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export default isAuth;
