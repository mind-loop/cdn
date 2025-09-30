const express = require("express");
const router = express.Router();
const { emailHTMLsent, emailTXTsent } = require("../controller/email");

router.route("/html").post(emailHTMLsent)
router.route("/txt").post(emailTXTsent);
module.exports = router;
