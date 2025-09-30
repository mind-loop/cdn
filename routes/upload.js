const express = require("express");
const router = express.Router();
const { uploadFile } = require("../controller/upload");

router.route("/").post(uploadFile)
module.exports = router;
