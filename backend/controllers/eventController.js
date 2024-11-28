const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { Event } = require("../models/eventModel");
const { createEvent } = require("../utils/zodSchemas");
const {User} = require("../models/userModel");

// Create an event
exports.createEvent = async (req, res) => {
    const createPayload = req.body;
    const parsedPayload = createEvent.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(400).json({ msg: "Invalid inputs", errors: parsedPayload.error.errors });
    }

    try {
        const user = req.user;  // Get the current logged-in user

        const event = new Event({
            title: createPayload.title,
            description: createPayload.description,
            date: createPayload.date,
            time: createPayload.time,
            labels: createPayload.labels || [],
            rsvp: [{ userId: user._id, eventRole: "organizer" }],  // Automatically set the user as the organizer
        });

        await event.save();
        res.status(201).json({ msg: "Event scheduled successfully", event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update event by title
exports.updateEvent = async (req, res) => {
    const { title } = req.params;
    const { title: newTitle, description, date, time, labels } = req.body;

    const updateFields = { title: newTitle, description, date, time, labels };

    try {
        const updatedEvent = await Event.findOneAndUpdate(
            { title },
            updateFields,
            { new: true, runValidators: true }
        );
        if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

        res.json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//List of authorised emails which can delete the event 
const authorizedEmails =[
    "mayurgk2006@gmail.com"
    //others as per requirement
]

// DELETE route for deleting an event by title
exports.deleteEvent = async (req, res) => {
    const { title } = req.params;
  
    try {
      // Find event by title
      const event = await Event.findOne({ title });
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check if the logged-in user's email is in authorizedEmails
      if (!authorizedEmails.includes(req.user.email)) {
        return res.status(403).json({ message: "You are not authorized to delete this event" });
      }
  
      // Delete the event
      await event.deleteOne();

      res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

// RSVP to an event
exports.rsvpEvent = async (req, res) => {
    const { eventId } = req.params;
    const { eventRole } = req.body;

    if (!["volunteer", "attendee"].includes(eventRole)) {  // Remove "organizer" role option
        return res.status(400).json({ message: "Invalid eventRole. Choose from 'volunteer' or 'attendee'." });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const user = req.user;
        const existingRSVP = event.rsvp.find(r => r.userId.toString() === user._id.toString());
        if (existingRSVP) return res.status(400).json({ message: "User has already RSVP'd" });

        event.rsvp.push({ userId: user._id, eventRole });
        await event.save();
        res.json({ message: "RSVP successful", event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a user from the event RSVP list (only by organizer)
exports.removeRSVP = async (req, res) => {
    const { eventId, usernameToRemove } = req.params;  // Use usernameToRemove as the parameter

    try {
        // Find the event by its ID
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // Check if the current user is the organizer of the event
        const user = req.user; // req.user is set by the authenticateJWT middleware
        const isOrganizer = event.rsvp.some(rsvp => rsvp.userId.toString() === user._id.toString() && rsvp.eventRole === 'organizer');
        
        if (!isOrganizer) {
            return res.status(403).json({ message: "Only the organizer can remove attendees or volunteers" });
        }

        // Find the RSVP entry for the user to be removed by their userId
        const userToRemove = await User.findOne({ username: usernameToRemove });  // Find user by username
        if (!userToRemove) return res.status(404).json({ message: "User not found" });

        // Find the RSVP entry for the user to be removed by their userId
        const rsvpIndex = event.rsvp.findIndex(rsvp => rsvp.userId.toString() === userToRemove._id.toString());
        if (rsvpIndex === -1) {
            return res.status(404).json({ message: "User not found in RSVP list" });
        }

        // Remove the user from the RSVP list
        event.rsvp.splice(rsvpIndex, 1);
        await event.save();

        res.json({ message: `User with username ${usernameToRemove} has been removed from the event` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET events organized, volunteered or attended by a user
exports.getUserEvents = async (req, res) => {
    try {
        const userId = req.user._id;  // Get the logged-in user's ID from the request

        // Find all events where the user has a role in the RSVP list (organizer, volunteer, or attendee)
        const events = await Event.find({
            "rsvp.userId": userId,  // Match events where the user is in the RSVP list
        });

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this user." });
        }

        res.json({ message: "Events found", events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Remove attendee
exports.removeAttendee = async (req, res) => {
    const { eventId, usernameToRemove } = req.params;

    try {
        const event = await Event.findById(eventId); // Corrected: findbyId -> findById
        if (!event) return res.status(404).json({ message: "Event not found" });

        const user = req.user;
        const isVolunteer = event.rsvp.some(
            (rsvp) => rsvp.userId.toString() === user._id.toString() && rsvp.eventRole === "volunteer"
        );

        if (!isVolunteer) {
            return res.status(403).json({ message: "Only volunteers can remove the attendees" });
        }

        const userToRemove = await User.findOne({ username: usernameToRemove }); // Corrected: await.User -> await User
        if (!userToRemove) return res.status(404).json({ message: "User not found" });

        const rsvpIndex = event.rsvp.findIndex(
            (rsvp) => rsvp.userId.toString() === userToRemove._id.toString() // Corrected: toSting -> toString
        );
        if (rsvpIndex === -1) {
            return res.status(404).json({ message: "User not found in RSVP list" });
        }

        event.rsvp.splice(rsvpIndex, 1);
        await event.save();

        res.json({ message: `User with username ${usernameToRemove} has been removed from the event` }); // Corrected: fixed interpolation
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
