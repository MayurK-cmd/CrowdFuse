// Event Create, Update and Rsvp routes
const express = require("express");
const { createEvent, updateEvent, rsvpEvent, deleteEvent, removeRSVP, getUserEvents, removeAttendee, getEventsByLabel, getEventsByOrganizer, getEventsNearMe, getAllEvents } = require("../controllers/eventController");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

router.post("/", authenticateJWT, createEvent);//over
router.put("/title/:title", authenticateJWT, updateEvent);
router.delete("/:title", authenticateJWT, deleteEvent)
router.post("/:eventId/rsvp", authenticateJWT, rsvpEvent);//over
router.delete("/:eventId/rsvp/:usernameToRemove", authenticateJWT, removeRSVP);
router.get("/user-events", authenticateJWT, getUserEvents);//over
router.delete("/:eventId/remove-attendee/:usernameToRemove", authenticateJWT, removeAttendee);
router.get('/all', authenticateJWT, getAllEvents); // GET all events with optional filters//over
router.get('/search/labels', authenticateJWT, getEventsByLabel); // Search by labels//over
router.get('/search/organizer/:username', authenticateJWT, getEventsByOrganizer); // Search by organizer//over
router.get('/nearby', authenticateJWT, getEventsNearMe); // Events near user location


module.exports = router;
