const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: {
      version: "v1.0.0",
      message: "New API is here",
      points: [
        "1. File upload",
        "2. File management",
        "3. Email service",
        "4. Mongolian Company Registered",
        "5. Mongolian sum and aimag info",
      ],
      ideas: [
        "User Login/Signup",
        "Qpay integration",
        "Link shortening",
        "Mongolian citys weather",
        "Weather info"
      ]
    },
    success: true,
  });
});
module.exports = router;
