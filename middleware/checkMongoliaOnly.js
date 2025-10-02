const { default: axios } = require("axios");

// Монголд байгаа эсэхийг шалгах middleware
async function checkMongoliaOnly(req, res, next) {
  try {
    // Клиентийн IP авна
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Хэрэв local machine бол test хийхэд ашиглах IP зааж болно
    const targetIp = ip === "::1" ? "103.229.120.1" : ip; // Mongolia IP example
    // Гео мэдээлэл авах (ipapi)
    await axios(`https://ipapi.co/${targetIp}/json/`).then((response)=>{
    req.clientLocation = {
      ip: targetIp,
      country: response.data.country_name,
      city: response.data.city
    };

    // Монгол биш бол блоклох
    if (response.data.country_name !== "Mongolia") {
      return res.status(403).json({
        success: false,
        error: "Only permission required Mongolia",
        location: req.clientLocation
      });
    }
    });
    // Хэрэглэгчийн байрлал хадгалах
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
