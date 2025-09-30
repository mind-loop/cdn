const express = require("express");
const dotenv = require("dotenv");
var path = require("path");
const fileUpload = require("express-fileupload");
var rfs = require("rotating-file-stream");
const colors = require("colors");
const errorHandler = require("./middleware/error");
var morgan = require("morgan");
const logger = require("./middleware/logger");
// Router оруулж ирэх
const uploadRoutes = require("./routes/upload")
const successRoutes = require("./routes/success");
const cors = require("cors");
// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

const app = express();
// ---- Custom Console Logger ----
app.use(logger);

// create a write stream (in append mode)

const accessLogStream = rfs.createStream(
  (time, _) => {
    if (!time) return "access.log";
    // access-2025-09-30.log
    const date = time.toISOString().slice(0, 10);
    return `access-${date}.log`;
  },
  {
    interval: "1d", // өдөр бүр
    path: path.join(__dirname, "logs", "access"),
    size: "10M",    // 10MB хүрэхэд шинэ файл
    compress: "gzip",
  }
);
app.use(morgan("combined", { stream: accessLogStream }));


// Body parser
app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use(express.static("public"));
app.use("/api/upload", uploadRoutes);
app.use("/api/v1", successRoutes);
app.use(errorHandler);
const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
