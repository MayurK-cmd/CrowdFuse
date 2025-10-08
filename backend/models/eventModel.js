const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    title: String,
    description: String,
    date: String,
    time: String,
    labels: { type: [String], default: [] },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: String,
        state: String,
        country: String
    },
    rsvp: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            eventRole: { type: String, enum: ["volunteer", "organizer", "attendee"], required: true },
        }
    ]
});

// // Create a 2dsphere index for geospatial queries
// eventSchema.index({ location: '2dsphere' });

// // Index for faster label searches
// eventSchema.index({ labels: 1 });

// // Index for faster organizer searches
// eventSchema.index({ "rsvp.userId": 1, "rsvp.eventRole": 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };