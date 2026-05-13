const { validationResult } = require("express-validator");
const AppError = require("../errors/AppError");
const ERROR_CODES = require("../errors/errorCodes");

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new AppError(
                "Validation failed",
                400,
                ERROR_CODES.VALIDATION_ERROR,
                errors.array()
            )
        );
    }

    next();
}

module.exports = validateRequest;