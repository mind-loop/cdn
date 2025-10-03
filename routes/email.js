const express = require("express");
const router = express.Router();
const { emailHTMLsent, emailTXTsent } = require("../controller/email");
const checkMongoliaOnly = require("../middleware/checkMongoliaOnly");

router.route("/html").post(checkMongoliaOnly, emailHTMLsent)
router.route("/txt").post(checkMongoliaOnly, emailTXTsent);
module.exports = router;
