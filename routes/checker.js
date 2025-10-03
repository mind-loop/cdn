const express = require("express");
const router = express.Router();
const checkMongoliaOnly = require("../middleware/checkMongoliaOnly");

router.route("/location").get(checkMongoliaOnly)
module.exports = router;
