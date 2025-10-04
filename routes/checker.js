const express = require("express");
const router = express.Router();
const checkMongoliaOnly = require("../middleware/checkMongoliaOnly");
const { checker_location } = require("../controller/checker");

router.route("/location").get(checker_location)
module.exports = router;
