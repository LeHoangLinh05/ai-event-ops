const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const validateRequest = require("./shared/middlewares/validate.middleware");
const AppError = require("./shared/errors/AppError");
const ERROR_CODES = require("./shared/errors/errorCodes");
const notFoundMiddleware = require("./shared/middlewares/not-found.middleware");
const errorMiddleware = require("./shared/middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "AI Event Operation Assistant API",
    });
});

app.use("/api", routes);

app.use(validateRequest);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;