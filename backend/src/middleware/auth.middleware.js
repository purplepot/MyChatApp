import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorised - no tokken found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorised - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect Route", error.message);
    return res.status(500).json({ message: "Internal sever error" });
  }
};

export default protectRoute;
