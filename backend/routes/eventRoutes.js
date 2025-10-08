// Event Create, Update and Rsvp routes
const express = require("express");
const { createEvent, updateEvent, rsvpEvent, deleteEvent, removeRSVP, getUserEvents, removeAttendee, getEventsByLabel, getEventsByOrganizer, getEventsNearMe, getAllEvents } = require("../controllers/eventController");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

router.post("/", authenticateJWT, createEvent);
router.put("/title/:title", authenticateJWT, updateEvent);
router.delete("/:title", authenticateJWT, deleteEvent)
router.post("/:eventId/rsvp", authenticateJWT, rsvpEvent);
router.delete("/:eventId/rsvp/:usernameToRemove", authenticateJWT, removeRSVP);
router.get("/user-events", authenticateJWT, getUserEvents);
router.delete("/:eventId/remove-attendee/:usernameToRemove", authenticateJWT, removeAttendee);
router.get('/all', authenticateJWT, getAllEvents); // GET all events with optional filters
router.get('/search/labels', authenticateJWT, getEventsByLabel); // Search by labels
router.get('/search/organizer/:username', authenticateJWT, getEventsByOrganizer); // Search by organizer
router.get('/nearby', authenticateJWT, getEventsNearMe); // Events near user location


module.exports = router;
