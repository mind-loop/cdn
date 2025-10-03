const express = require("express");
const router = express.Router();
const { uploadFile, cleanOldImages } = require("../controller/upload");
const checkMongoliaOnly = require("../middleware/checkMongoliaOnly");

router.route("/").post(checkMongoliaOnly, uploadFile)
router.route("/delete").delete(checkMongoliaOnly, cleanOldImages); // TODO: Файл устгах
module.exports = router;
