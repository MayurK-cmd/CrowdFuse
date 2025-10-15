// Event Create, Update and Rsvp routes
const express = require("express");
const { createEvent, updateEvent, rsvpEvent, deleteEvent, removeRSVP, getUserEvents, removeAttendee, getEventsByLabel, getEventsByOrganizer, getEventsNearMe, getAllEvents } = require("../controllers/eventController");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

router.post("/", authenticateJWT, createEvent);//Creates an event
router.post("/:eventId/rsvp", authenticateJWT, rsvpEvent);//RSVP to an event
router.get("/user-events", authenticateJWT, getUserEvents);//Get events created or RSVP'd by the user
router.get('/all', authenticateJWT, getAllEvents); // GET all events with optional filters
router.get('/search/labels', authenticateJWT, getEventsByLabel); // Search by labels
//router.get('/search/organizer/:firstname', authenticateJWT, getEventsByOrganizer); // Search by organizer


router.get('/nearby', authenticateJWT, getEventsNearMe); // Events near user location



router.put("/title/:title", authenticateJWT, updateEvent);//Update event details by title
router.delete("/:title", authenticateJWT, deleteEvent)//Delete event by title only by authed emails
router.delete("/:eventId/rsvp/:emailToRemove", authenticateJWT, removeRSVP);//organizer can remove an RSVP
router.delete("/:eventId/remove-attendee/:emailToRemove", authenticateJWT, removeAttendee);//volunteer can remove an attendee

module.exports = router;
