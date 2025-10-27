const geoip = require("geoip-lite");

function checkMongoliaOnly(req, res, next) {
  try {
    // Клиентийн IP хаягийг авна
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket?.remoteAddress;

    // localhost бол тест IP ашиглая
    const targetIp = ip === "::1" || ip === "127.0.0.1" ? "103.229.120.1" : ip;

    // IP мэдээлэл хайна
    const geo = geoip.lookup(targetIp);

    if (!geo) {
      return res.status(500).json({
        success: false,
        error: "Байршлын мэдээлэл олдсонгүй",
        ip: targetIp
      });
    }

    // Улсын код шалгах
    const isMongolia = geo.country === "MN";

    // Хэрэглэгчийн мэдээллийг хадгална
    req.clientLocation = {
      ip: targetIp,
      country: geo.country, // "MN"
      region: geo.region, // аймаг/бүсийн код
      city: geo.city || "Unknown"
    };

    // Хэрэв Монгол биш бол блоклох
    if (!isMongolia) {
      return res.status(403).json({
        success: false,
        error: "Монгол Улсын хэрэглэгчдэд л зөвшөөрөгдөнө",
        location: req.clientLocation
      });
    }

    // Монгол бол цааш үргэлжлүүлнэ
    next();
  } catch (err) {
    console.error("GeoIP Error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Байршил тодорхойлох үед алдаа гарлаа"
    });
  }
}

module.exports = checkMongoliaOnly;
