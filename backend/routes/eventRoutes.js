// Event Create, Update and Rsvp routes
const express = require("express");
const { createEvent, updateEvent, rsvpEvent } = require("../controllers/eventController");
const { authenticateJWT } = require("../middleware/authenticateJWT");
const router = express.Router();

router.post("/", authenticateJWT, createEvent);
router.put("/title/:title", authenticateJWT, updateEvent);
router.post("/:eventId/rsvp", authenticateJWT, rsvpEvent);

module.exports = router;
