const colors = require("colors");
const dayjs = require("dayjs");

const logger = (req, res, next) => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const log = `[${now}] ${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log(log.green);
  next();
};

module.exports = logger;
