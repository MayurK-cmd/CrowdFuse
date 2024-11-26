// Zod schema for event
const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    title: String,
    description: String,
    date: String,
    time: String,
    labels: { type: [String], default: [] },
    rsvp: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            eventRole: { type: String, enum: ["volunteer", "organizer", "attendee"], required: true },
        }
    ]
});

// module.exports = mongoose.model('Event', eventSchema);

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };
