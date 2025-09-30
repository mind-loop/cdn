const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  if (!options.email || !/^[\w.-]+@[\w.-]+\.\w+$/.test(options.email) || options.email.split("@")[0].length < 4) {
    throw new Error("Зөв имэйл хаяг оруулна уу.");
  }

  let transporter = nodemailer.createTransport({
    service: "gmail", // эсвэл өөр SMTP
    auth: {
      user: options.smtp_username,
      pass: options.smtp_password,
    },
  });

  const mailOptions = {
    from: options.from ? `${options.from} <${options.smtp_username}>` : `Систем <${process.env.SPONSOR_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    ...(options.isHtml ? { html: options.message } : { text: options.message }),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent: ", info.response);
  return info;
};

module.exports = sendEmail;