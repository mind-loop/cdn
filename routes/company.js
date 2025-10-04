const express = require("express");
const router = express.Router();
const checkMongoliaOnly = require("../middleware/checkMongoliaOnly");
const { companyFindRgstr } = require("../controller/company");

router.route("/regno/:register").get(checkMongoliaOnly, companyFindRgstr);
module.exports = router;
