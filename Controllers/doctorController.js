import { query } from "express";
import DoctorSchema from "../modules/DoctorSchema.js";
import BookingSchema from "../modules/BookingSchema.js";
import UserSchema from "../modules/UserSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updateDoctor = await DoctorSchema.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Successfully updated Doctor",
      data: updateDoctor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update Doctor",
    });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await DoctorSchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted Doctor",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Doctor",
    });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await DoctorSchema.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name photo",
        },
      })
      .select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await DoctorSchema.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await DoctorSchema.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: doctors,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

// export const getDoctorProfile = async (req, res) => {
//   const doctorId = req.doctorId;
//   try {
//     const doctor = await DoctorSchema.findById(doctorId);

//     if (!doctor) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User Not found" });
//     }

//     const { password, ...rest } = user._doc;
//     const appointments = await BookingSchema.find({ doctor: doctorId });

//     res.status(200).json({
//       success: true,
//       message: "profile info is getting ",
//       data: { ...rest, appointments },
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong, connot get",
//     });
//   }
// };
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await DoctorSchema.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;
    const appointments = await BookingSchema.find({ doctor: doctorId });

    res.status(200).json({
      success: true,
      message: "Profile info retrieved successfully",
      data: { ...rest, appointments },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, unable to retrieve profile info",
    });
  }
};
