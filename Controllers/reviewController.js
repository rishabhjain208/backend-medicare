import ReviewSchema from "../modules/ReviewSchema.js";
import DoctorSchema from "../modules/DoctorSchema.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await ReviewSchema.find({})
      .populate("user", "name photo")
      .exec();

    res.status(200).json({
      success: true,
      message: "Successfully fetched reviews",
      data: reviews,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err });
  }
};

// create Reviews
export const createReviews = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.params.userId;

  const newReviews = new ReviewSchema(req.body);

  try {
    const savedReview = await newReviews.save();

    await DoctorSchema.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });
    res
      .status(200)
      .json({ succcess: true, message: "Review submitted", data: savedReview });
  } catch (err) {
    res.status(500).json({ succcess: false, message: err.message });
  }
};
