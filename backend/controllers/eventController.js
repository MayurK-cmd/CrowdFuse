const { authenticateJWT } = require("../middlewares/authenticateJWT");
const { Event } = require("../models/eventModel");
const { createEvent } = require("../utils/zodSchemas");


// Create an event
exports.createEvent = async (req, res) => {
    const createPayload = req.body;
    const parsedPayload = createEvent.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(400).json({ msg: "Invalid inputs", errors: parsedPayload.error.errors });
    }

    try {
        const event = new Event({
            title: createPayload.title,
            description: createPayload.description,
            date: createPayload.date,
            time: createPayload.time,
            labels: createPayload.labels || [],
            rsvp: [],
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

    if (!["volunteer", "organizer", "attendee"].includes(eventRole)) {
        return res.status(400).json({ message: "Invalid eventRole. Choose from 'volunteer', 'organizer', or 'attendee'." });
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
