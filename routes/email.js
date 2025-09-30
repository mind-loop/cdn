const express = require("express");
const router = express.Router();
const { emailHTMLsent, emailTXTsent, getEmails, createEmail, activeEmail, changeActiveEmail, getEmail, deleteEmail, updateEmail } = require("../controller/email");

router.route("/html").post(emailHTMLsent)
router.route("/txt").post(emailTXTsent);
router.route("/account").get(getEmails).post(createEmail);
router.route("/active").get(activeEmail);
router.route("/active/:id").post(changeActiveEmail);
router
  .route("/:id").get(getEmail).delete(deleteEmail).put(updateEmail);
module.exports = router;
