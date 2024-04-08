const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  verifyOtp
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.route("/verification/:id").post(verifyOtp);
router.post("/login", authUser);

module.exports = router;
