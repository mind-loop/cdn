const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

exports.generateLengthPass = (len) => {
    const number = Math.pow(10, len);
    return Math.floor((Math.random() * 9 * number) / 10) + number / 10 + "";
};

exports.generateLengthDate = (days) => {
    const futureDate = dayjs().add(days, 'day').tz("Asia/Ulaanbaatar").startOf("day");
    return futureDate.format("YYYY-MM-DD HH:mm:ss");
};


exports.emailTemplate = (message) => {
    return `<!DOCTYPE html>
  <html lang="mn">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Цахим Меню Бүртгэл</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f9fafb;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 800px;
              margin: auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #28a745;
          }
          .header h1 {
              color: #28a745;
          }
          .content {
              padding: 20px 0;
          }
          .content p {
              font-size: 16px;
              line-height: 1.6;
          }
          .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 0.9em;
              color: #666;
          }
          .btn {
              display: inline-block;
              padding: 10px 20px;
              color: #fff;
              background-color: #28a745;
              text-decoration: none;
              border-radius: 5px;
          }
          .btn:hover {
              background-color: #218838;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Сайн байна уу?</h1>
          </div>
          <div class="content">
              <p>Та <strong>"QR цахим дэлгүүрийн танилцуулга систем"</strong>-д ${message.title ? message.title : ""}</p>
              <p>${message.label ? message.label : ''}</p>
              <p><strong>Холбоос:</strong> <a href="${process.env.WEBSITE_URL}"> ${process.env.WEBSITE_URL}</a></p>
              <p>Өдрийг сайхан өнгөрүүлээрэй! ☀️</p>
          </div>
          <div class="footer">
              <p><a href="${process.env.SPONSOR_COMPANY_URL}">${process.env.SPONSOR_COMPANY_URL}</a> &copy; ${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.</p>
          </div>
      </div>
  </body>
  </html>
`};


/**
 * ensureDir - Хэрэв хавтас байхгүй бол автоматаар үүсгэнэ
 * @param {string} dirPath
 */
const fs = require("fs");
exports.ensureDir = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        return true;
    }
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
};