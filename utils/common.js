const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const fs = require("fs");
const path = require("path");
const MyError = require("./myError");
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

/**
 * Ерөнхий HTML email template
 * @param {Object} options
 * @param {string} options.title - Гарчиг
 * @param {string} options.text - Мессеж / тайлбар
 * @param {string} [options.buttonText] - Товч дээр гарах текст (default: "Систем рүү очих")
 * @param {string} [options.buttonUrl] - Товч дарах холбоос (default: process.env.WEBSITE_URL)
 * @param {string} [options.greeting] - Мэндчилгээ (default: "Сайн байна уу?")
 * @param {string} [options.from] - Илгээсэн хүний нэр
 */
exports.emailTemplate = ({
    title = "Гарчиг оруулаагүй байна",
    label = "Тайлбар оруулаагүй байна",
    buttonText = "Систем рүү очих",
    buttonUrl = process.env.WEBSITE_URL || "#",
    greeting = "Сайн байна уу?",
    from = ""
} = {}) => `
<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 0; }
    .wrapper { width: 100%; padding: 30px 0; background: #f4f6f8; }
    .container { max-width: 700px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1); padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #007BFF; padding-bottom: 15px; margin-bottom: 25px; }
    .header h1 { color: #007BFF; margin: 0; font-size: 24px; }
    .content p { font-size: 16px; color: #333; line-height: 1.6; margin: 12px 0; }
    .button-wrapper { text-align: center; margin: 25px 0; }
    a.button { text-decoration: none; background: #007BFF; color: #fff; padding: 12px 24px; border-radius: 6px; font-weight: bold; transition: 0.3s; display: inline-block; }
    a.button:hover { background: #0056b3; }
    .footer { text-align: center; font-size: 0.85em; color: #888; margin-top: 30px; }
    @media only screen and (max-width: 600px) { .container { padding: 20px; } .header h1 { font-size: 20px; } }
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
        <p><strong>Мессеж:</strong> ${label}</p>
      </div>
      <div class="button-wrapper">
        <a class="button" href="${buttonUrl}">${buttonText}</a>
      </div>
      <div class="footer">
        <p>${from ? "Илгээсэн: " + from + " | " : ""}<a href="${process.env.SPONSOR_COMPANY_URL || "#"}">${process.env.SPONSOR_COMPANY_URL || ""}</a> &copy; ${new Date().getFullYear()}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;



/**
 * ensureDir - Хэрэв хавтас байхгүй бол автоматаар үүсгэнэ
 * @param {string} dirPath
 */
exports.ensureDir = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        return true;
    }
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
};

/**
* Хуучин жилийн файлуудыг устгах
* @param { string } type - images, documents гэх мэт
* @param { number } expireYear - энэ жилээс өмнөх файлууд устна
 */
exports.cleanOldFolders = async (type, expireYear) => {
    const base = path.join(process.env.PHOTO_FOLDER_PATH, type);
    if (!fs.existsSync(base)) throw new MyError("Upload хавтас олдсонгүй", 404);

    const years = await fs.promises.readdir(base);
    const deleted = [];

    for (const year of years) {
        const folder = path.join(base, year);
        const stat = await fs.promises.stat(folder);

        if (stat.isDirectory() && Number(year) < expireYear) {
            await fs.promises.rm(folder, { recursive: true, force: true });
            deleted.push(year);
            console.log(`🗑️ ${type} - ${year} хавтас устгав`);
        }
    }

    if (!deleted.length) throw new MyError("Устгах хавтас олдсонгүй", 404);
    return deleted;
};