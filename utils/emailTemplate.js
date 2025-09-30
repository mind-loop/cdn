/**
 * Ерөнхий HTML email template
 * @param {Object} options - email мэдээлэл
 * @param {string} options.title - Гарчиг
 * @param {string} options.label - Тайлбар/мессеж
 * @param {string} options.buttonText - Товч дээр гарах текст
 * @param {string} options.buttonUrl - Товч дарах холбоос
 * @param {string} options.greeting - Мэндчилгээ
 */
exports.emailTemplate = ({
    title = "Гарчиг оруулаагүй байна",
    label = "Тайлбар оруулаагүй байна",
    buttonText = "Систем рүү очих",
    buttonUrl = process.env.WEBSITE_URL || "#",
    greeting = "Сайн байна уу?",
} = {}) => `
<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      width: 100%;
      padding: 30px 0;
      background-color: #f4f6f8;
    }
    .container {
      max-width: 700px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #007BFF;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .header h1 {
      color: #007BFF;
      margin: 0;
      font-size: 24px;
    }
    .content p {
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
      margin: 12px 0;
    }
    .button-wrapper {
      text-align: center;
      margin: 25px 0;
    }
    a.button {
      text-decoration: none;
      background-color: #007BFF;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 6px;
      display: inline-block;
      font-weight: bold;
      transition: background 0.3s ease;
    }
    a.button:hover {
      background-color: #0056b3;
    }
    .footer {
      text-align: center;
      font-size: 0.85em;
      color: #888888;
      margin-top: 30px;
    }
    @media only screen and (max-width: 600px) {
      .container { padding: 20px; }
      .header h1 { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${greeting}</h1>
      </div>
      <div class="content">
        <p><strong>Гарчиг:</strong> ${title}</p>
        <p><strong>Тайлбар:</strong> ${label}</p>
      </div>
      <div class="button-wrapper">
        <a class="button" href="${buttonUrl}">${buttonText}</a>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} <a href="${process.env.SPONSOR_COMPANY_URL || '#'}">${process.env.SPONSOR_COMPANY_URL || ''}</a>. Бүх эрх хуулиар хамгаалагдсан.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
