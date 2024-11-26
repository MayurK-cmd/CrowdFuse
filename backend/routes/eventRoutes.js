// Event Create, Update and Rsvp routes
const express = require("express");
const { createEvent, updateEvent, rsvpEvent, deleteEvent } = require("../controllers/eventController");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

router.post("/", authenticateJWT, createEvent);
router.put("/title/:title", authenticateJWT, updateEvent);
router.delete("/:title", authenticateJWT, deleteEvent)
router.post("/:eventId/rsvp", authenticateJWT, rsvpEvent);

module.exports = router;
