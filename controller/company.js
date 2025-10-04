const axios = require("axios");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
exports.companyFindRgstr = asyncHandler(async (req, res, next) => {
    const { register } = req.params;
    if (!register) {
        throw new MyError("Регистр байхгүй байна", 404);
    }
    const url = `https://info.ebarimt.mn/rest/merchant/info?regno=${register}`;
    try {
        const response = await axios.get(url, { timeout: 10000 }); // 10 seconds timeout
        res.status(200).json({
            message: "",
            body: response.data,
        });
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === "ECONNABORTED") {
            errorMessage = "Request timed out";
        }
        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
            },
        });
    }
});
