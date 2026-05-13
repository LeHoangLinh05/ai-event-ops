const AppError = require("../errors/AppError");
const ERROR_CODES = require("../errors/errorCodes");

function notFoundMiddleware(req, res, next) {
    next(
        new AppError(
            `Route not found: ${req.originalUrl}`,
            404,
            ERROR_CODES.NOT_FOUND
        )
    );
}

module.exports = notFoundMiddleware;