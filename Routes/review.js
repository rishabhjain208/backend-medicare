import express from "express";
import {
  getAllReviews,
  createReviews,
} from "../Controllers/reviewController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/", getAllReviews);
router.post(
  "/:doctorId/reviews",
  authenticate,
  restrict(["patient"]),
  createReviews
);

export default router;
