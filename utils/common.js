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
exports.emailTemplate = ({ title, label, buttonText, buttonUrl, greeting }) => {
  return `
    <div style="background-color: #f6f9fc; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #0052cc; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">${title}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
          <h2 style="font-size: 20px; margin-top: 0; color: #111;">${greeting || "Сайн байна уу?"}</h2>
          <p style="font-size: 16px; color: #555; margin-bottom: 30px;">${label}</p>
          
          ${buttonText && buttonUrl ? `
            <div style="text-align: center; margin: 40px 0;">
              <a href="${buttonUrl}" style="background-color: #0052cc; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                ${buttonText}
              </a>
            </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 14px; color: #888;">Хэрэв та энэ хүсэлтийг гаргаагүй бол энэ имэйлийг үл тоомсорлож болно.</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 2px;">
            Powered by <span style="color: #0052cc; font-weight: bold;">itwork LLC</span>
          </p>
          <div style="margin-top: 10px;">
            <a href="https://itwork.mn" style="text-decoration: none; color: #0052cc; font-size: 12px;">itwork.mn</a>
          </div>
        </div>
      </div>
    </div>
  `;
};



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