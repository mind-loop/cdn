const { default: axios } = require("axios");
const asyncHandler = require("../middleware/asyncHandle");

exports.checker_location = asyncHandler(async (req, res, next) => {
    try {
        // Клиентийн IP авна
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        // Хэрэв local machine бол test хийхэд ашиглах IP зааж болно
        const targetIp = ip === "::1" ? "103.229.120.1" : ip; // Mongolia IP example
        // Гео мэдээлэл авах (ipapi)
        await axios(`https://ipapi.co/${targetIp}/json/`).then((response) => {
            return res.status(400).json({
                success: true,
                location: response.data,
            });
        });
        // Хэрэглэгчийн байрлал хадгалах
        // Монгол бол цааш үргэлжлүүлнэ

    } catch (err) {
        console.error("GeoIP Error:", err.message);
        return res.status(500).json({
            success: false,
            error: "Байршил тодорхойлох үед алдаа гарлаа"
        });
    }
});