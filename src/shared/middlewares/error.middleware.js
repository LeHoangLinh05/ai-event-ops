const ERROR_CODES = require("../errors/errorCodes");

function errorMiddleware(error, req, res, next) {
    console.error(error);

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            code: ERROR_CODES.INVALID_ID,
            message: "Invalid ID format",
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            code: ERROR_CODES.DUPLICATE_KEY,
            message: "Duplicate value",
            details: error.keyValue,
        });
    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        code: error.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
        details: error.details || null,
    });
}

module.exports = errorMiddleware;