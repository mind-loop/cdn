const asyncHandler = require("../middleware/asyncHandle");
const sendEmail = require("../utils/email");
const MyError = require("../utils/myError");
const { emailTemplate } = require("../utils/common");
// Text email илгээх
exports.emailTXTsent = asyncHandler(async (req, res, next) => {
  const { text, title, email, from } = req.body;

  if (!title || !text || !email || !from) {
    throw new MyError("Бүх талбарыг бөглөнө үү", 400);
  }

  // Текст имэйл дээр Footer залгах
  const fullText = `${text}\n\n---\nPowered by itwork LLC`;

  await sendEmail({
    subject: title,
    email,
    from,
    message: fullText,
    isHtml: false,
    smtp_username: process.env.SMTP_USERNAME,
    smtp_password: process.env.SMTP_PASSWORD,
  });

  res.status(200).json({ success: true, message: "Имэйл амжилттай илгээгдлээ" });
});

// HTML email илгээх
exports.emailHTMLsent = asyncHandler(async (req, res, next) => {
  const { title, label, email, from, buttonText, buttonUrl, greeting } = req.body;

  if (!title || !label || !email || !from) {
    throw new MyError("Бүх талбарыг бөглөнө үү", 400);
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

  res.status(200).json({ success: true, message: "Загварчилсан имэйл амжилттай илгээгдлээ" });
});