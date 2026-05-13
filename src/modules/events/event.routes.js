const express = require("express");
const eventController = require("./event.controller");

const {
    createEventValidation,
    updateEventValidation,
} = require("./event.validation");

const validateRequest = require("../../shared/middlewares/validate.middleware");

const router = express.Router();

router.post(
    "/",
    createEventValidation,
    validateRequest,
    eventController.createEvent
);

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

router.put(
    "/:id",
    updateEventValidation,
    validateRequest,
    eventController.updateEvent
);

router.delete("/:id", eventController.deleteEvent);
router.patch("/:id/publish", eventController.publishEvent);

module.exports = router;