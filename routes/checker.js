const express = require("express");
const router = express.Router();
const { checker_location } = require("../controller/checker");

router.route("/location").get(checker_location)
module.exports = router;
