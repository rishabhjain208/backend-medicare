import UserSchema from "../modules/UserSchema.js";
import BookingSchema from "../modules/BookingSchema.js";
import DoctorSchema from "../modules/DoctorSchema.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updateUser = await UserSchema.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Successfully updated user",
      data: updateUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await UserSchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted user",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserSchema.findById(id).select("-password");
    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await UserSchema.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: "Users found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await UserSchema.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not found" });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "profile info is getting ",
      data: { ...rest },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, connot get",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const booking = await BookingSchema.find({ user: req.userId });

    const doctorIds = booking.map((el) => el.doctor.id);

    const doctors = await DoctorSchema.find({ _id: { $in: doctorIds } }).select(
      -"password"
    );
    res.status(200).json({
      success: true,
      message: "Appointments are getting ",
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, connot get",
    });
  }
};
