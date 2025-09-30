const path = require("path");
const fs = require("fs");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
const cuid = require("cuid");
const { ensureDir, cleanOldFolders } = require("../utils/common");
/**
 * Universal file uploader
 *  - Supports type-based folders (e.g., image, docs)
 *  - Auto-creates year/month subfolders
 */
exports.uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    throw new MyError("Файл илгээгдээгүй байна.", 400);
  }

  const file = req.files.file;
  const type = req.query.type || "misc"; // ?type=image эсвэл docs гэх мэт
  const allowedTypes = {
    image: ["image/jpeg", "image/png", "image/webp"],
    docs: ["application/pdf", "application/msword"],
    misc: [] // ямар ч шалгалт хийхгүй
  };

  // MIME type шалгах
  if (allowedTypes[type] && allowedTypes[type].length > 0) {
    if (!allowedTypes[type].includes(file.mimetype)) {
      throw new MyError(`Таны файл зөвшөөрөгдөөгүй төрөлтэй байна.`, 400);
    }
  }

  // Файлын хэмжээ шалгах (байгаль орчны хувьсагчаар)
  const maxSize = parseInt(process.env.MAX_UPLOAD_FILE_SIZE || "5000000", 10);
  if (file.size > maxSize) {
    throw new MyError(`Файлын хэмжээ ${(maxSize / 1024 / 1024).toFixed(1)} MB-аас хэтэрч болохгүй.`, 400);
  }

  // Файл нэр үүсгэх
  const ext = path.extname(file.name).toLowerCase();
  const fileName = `${type}_${cuid()}${ext}`;

  // Хавтасны бүтцийг үүсгэх: uploads/type/YYYY/MM
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const uploadBase = process.env.PHOTO_FOLDER_PATH || path.join(__dirname, "../../uploads");
  const finalFolder = path.join(uploadBase, type, `${year}`, `${month}`);

  ensureDir(finalFolder);

  // Бүрэн зам
  const savePath = path.join(finalFolder, fileName);

  // Файл хадгалах
  await file.mv(savePath, (err) => {
    if (err) {
      throw new MyError(`Файл хадгалах явцад алдаа гарлаа: ${err.message}`, 500);
    }
  });

  // Public URL буцаах (жишээ: cdn.itwork.mn/files/...)
  const publicUrl = `${process.env.CDN_BASE_URL || ""}/${type}/${year}/${month}/${fileName}`;

  return res.status(200).json({
    success: true,
    body: {
      fileName,
      type,
      size: file.size,
      url: publicUrl
    }
  });
});


exports.cleanOldImages = asyncHandler(async (req, res, next) => {
  const { type, year } = req.body;

  if (!type) return res.status(400).json({ success: false, message: "type шаардлагатай" });

  const deleted = await cleanOldFolders(type, Number(year));

  res.status(200).json({
    success: true,
    message: `Дараах хавтаснууд устлаа: ${deleted.join(", ")}`,
  });
});