const geoip = require("geoip-lite");

// Зөвшөөрөгдсөн IP жагсаалт (жишээ нь VPN эсвэл тест серверүүд)
const correctIP = ["159.89.153.58", "103.229.120.1"];

function checkMongoliaOnly(req, res, next) {
  try {
    // Клиентийн IP хаягийг авах
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket?.remoteAddress;

    // IPv6 localhost бол тестийн IP ашиглая
    const targetIp = ip === "::1" || ip === "127.0.0.1" ? "103.229.120.1" : ip;

    // Зөвшөөрөгдсөн IP жагсаалтад байгаа эсэхийг шалгах
    if (correctIP.includes(targetIp)) {
      console.log(`✅ Whitelisted IP (${targetIp}) - Allowed without Geo check`);
      req.clientLocation = {
        ip: targetIp,
        country: "MN",
        region: "N/A",
        city: "Whitelist"
      };
      return next();
    }

    // GeoIP мэдээлэл авах
    const geo = geoip.lookup(targetIp);

    if (!geo) {
      return res.status(500).json({
        success: false,
        error: "Байршлын мэдээлэл олдсонгүй",
        ip: targetIp
      });
    }

    const isMongolia = geo.country === "MN";

    // Хэрэглэгчийн мэдээлэл хадгалах
    req.clientLocation = {
      ip: targetIp,
      country: geo.country,
      region: geo.region,
      city: geo.city || "Unknown"
    };

    // Монгол биш бол блоклох
    if (!isMongolia) {
      return res.status(403).json({
        success: false,
        error: "Монгол Улсын хэрэглэгчдэд л зөвшөөрөгдөнө",
        location: req.clientLocation
      });
    }

    // Монгол бол үргэлжлүүлэх
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
