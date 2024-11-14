// Create Event, Update Event, Rsvp to event
const { Event } = require("../models/eventModel");
const { createEvent } = require("../utils/zodSchemas");

// Create an event
exports.createEvent = async (req, res) => {
    const createPayload = req.body;
    const parsedPayload = createEvent.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(400).json({ msg: "You sent the wrong inputs", errors: parsedPayload.error.errors });
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
        res.json({ msg: "Event scheduled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update event by title
exports.updateEvent = async (req, res) => {
    const { title } = req.params;
    const { newTitle, description, date, time, labels } = req.body;

    const updateFields = { newTitle, description, date, time, labels };

    try {
        const updatedEvent = await Event.findOneAndUpdate({ title }, updateFields, { new: true, runValidators: true });
        if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// RSVP to an event
exports.rsvpEvent = async (req, res) => {
    const { eventId } = req.params;
    const { eventRole } = req.body;

    if (!["volunteer", "organizer", "attendee"].includes(eventRole)) {
        return res.status(400).json({ message: "Invalid eventRole" });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const user = req.user;
        const existingRSVP = event.rsvp.find(r => r.userId.toString() === user._id.toString());
        if (existingRSVP) return res.status(400).json({ message: "User has already RSVP'd" });

        event.rsvp.push({ userId: user._id, eventRole });
        await event.save();
        res.json({ message: "RSVP successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
