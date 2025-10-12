const asyncHandler = require("../middleware/asyncHandle");
const fs = require("fs")
const path = require("path");
exports.city = asyncHandler(async (req, res, next) => {
    const filePath = path.join(process.cwd(), "data","geo-service", "cities.json");
    const data = fs.readFileSync(filePath, "utf8");
    const provinces = JSON.parse(data);

    return res.status(200).json({
        success: true,
        body: {items:provinces, length:provinces.length}
    });
})

exports.districts = asyncHandler(async (req, res, next) => {
    const { city_id } = req.params; // URL-аас ирж байгаа city_id
    const filePath = path.join(process.cwd(), "data", "geo-service", "districts.json");
    
    // JSON файлыг уншина
    const data = fs.readFileSync(filePath, "utf8");
    const districts = JSON.parse(data);

    // city_id-ээр filter хийнэ
    const filtered = districts.filter(d => d.city_id === parseInt(city_id));

    return res.status(200).json({
        success: true,
        body: {items:filtered, length:filtered.length}
    });
});
