import jwt from "jsonwebtoken";
import DoctorSchema from "../modules/DoctorSchema.js";
import UserSchema from "../modules/UserSchema.js";

export const authenticate = async (req, res, next) => {
  // get token from headers
  const authToken = req.headers.authorization;

  // check token existence
  if (!authToken || !authToken.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    // verify token
    const token = authToken.split(" ")[1];
    // console.log(authToken);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;
  let user;

  const patient = await UserSchema.findById(userId);
  const doctor = await DoctorSchema.findOne({ _id: userId }); // Pass query object

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }

  if (!user || !roles.includes(user.role)) {
    // Check if user is not found or role is unauthorized
    return res
      .status(401)
      .json({ success: false, message: "You're not authorized" });
  }

  next();
};
