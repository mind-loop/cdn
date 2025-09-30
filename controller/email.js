const asyncHandler = require("../middleware/asyncHandle");
const sendEmail = require("../utils/email");
const MyError = require("../utils/myError");
const { emailTemplate } = require("../utils/common");
// Text email
exports.emailTXTsent = asyncHandler(async (req, res, next) => {
  const { text, title, email, from } = req.body;

  if (!title || !text || !email || !from) {
    throw new MyError("Алдаа гарлаа: бүх талбар заавал шаардлагатай", 400);
  }

  await sendEmail({
    subject: title,
    email,
    from,
    message: text,
    isHtml: false,
    smtp_username: process.env.SMTP_USERNAME,
    smtp_password: process.env.SMTP_PASSWORD,
  });

  res.status(200).json({
    message: "Email Text амжилттай илгээгдлээ",
    body: { success: true }
  });
});

// HTML email
exports.emailHTMLsent = asyncHandler(async (req, res, next) => {
  const { title, label, email, from, buttonText, buttonUrl, greeting } = req.body;

  if (!title || !label || !email || !from) {
    throw new MyError("Алдаа гарлаа: бүх талбар заавал шаардлагатай", 400);
  }

  const htmlMessage = emailTemplate({
    title,
    label,
    buttonText,
    buttonUrl,
    greeting
  });

  await sendEmail({
    subject: title,
    email,
    from,
    message: htmlMessage,
    isHtml: true,
    smtp_username: process.env.SMTP_USERNAME,
    smtp_password: process.env.SMTP_PASSWORD,
  });

  res.status(200).json({
    message: "Email HTML амжилттай илгээгдлээ",
    body: { success: true }
  });
});