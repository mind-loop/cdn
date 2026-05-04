const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Илүү боловсронгуй Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!options.email || !emailRegex.test(options.email)) {
    throw new Error("Зөв имэйл хаяг оруулна уу.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: options.SMTP_USERNAME,
      pass: options.SMTP_PASSWORD,
    },
  });

  // Хэрэв "from" байхгүй бол itwork LLC-ээс ирсэн мэт харагдуулна
  const fromDisplay = options.from 
    ? `${options.from} via itwork <${options.smtp_username}>` 
    : `itwork LLC <${options.smtp_username}>`;

  const mailOptions = {
    from: fromDisplay,
    to: options.email,
    subject: options.subject,
    // HTML имэйл дээр ч текст хувилбарыг (fallback) явуулах нь UX-д сайн
    text: options.isHtml ? "Please use an HTML compatible email client." : options.message,
    html: options.isHtml ? options.message : null,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Mail Transporter Error:", error);
    throw new Error("Имэйл сервертэй холбогдоход алдаа гарлаа.");
  }
};

module.exports = sendEmail;