const express = require("express");
const router = express.Router();
const { emailHTMLsent, emailTXTsent } = require("../controller/email");
const checkMongoliaOnly = require("../middleware/checkMongoliaOnly");
const { city, districts } = require("../controller/geo-service");

router.route("/city").get(checkMongoliaOnly, city);
router.route("/districts/:city_id").get(checkMongoliaOnly, districts);
module.exports = router;
