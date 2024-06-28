import Doctor from "../modules/DoctorSchema.js";
import Users from "../modules/UserSchema.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return Jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user;
    // Check role and find user accordingly
    if (role === "patient") {
      user = await Users.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }
    // check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user instance based on role
    if (role === "patient") {
      user = new Users({
        name,
        email,
        password: hashedPassword,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashedPassword,
        photo,
        gender,
        role,
      });
    } else {
      // Handle invalid role here, if needed
      return res.status(400).json({ message: "Invalid role" });
    }

    // save user to the database
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User Successfully Created" });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error, Try again" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;

    const patient = await Users.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // token
    const token = generateToken(user);
    const { password: userPassword, role, appointments, ...rest } = user;

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      data: user,
      role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error, Try again" });
  }
};
