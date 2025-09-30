const express = require("express");
const router = express.Router();
const { uploadFile, cleanOldImages } = require("../controller/upload");

router.route("/").post(uploadFile)
router.route("/delete").delete(cleanOldImages); // TODO: Файл устгах
module.exports = router;
