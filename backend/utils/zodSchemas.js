// Zod schema
const zod = require("zod");

const createEvent = zod.object({
    title: zod.string().min(1, "Title is required"),
    description: zod.string().min(1, "Description is required"),
    date: zod.string().min(1, "Date is required"),
    time: zod.string().min(1, "Time is required"),
    labels: zod.array(zod.string()).optional(),
    longitude: zod.number().min(-180).max(180, "Invalid longitude"),
    latitude: zod.number().min(-90).max(90, "Invalid latitude"),
    address: zod.string().min(1, "Address is required"),
    city: zod.string().optional(),
    state: zod.string().optional(),
    country: zod.string().optional()
});

const updateEvent = zod.object({
    id: zod.string().nonempty("Id of event is required"),
    title: zod.string().optional(),
    description: zod.string().optional(),
    date: zod.string().optional(),
    time: zod.string().optional(),
    labels: zod.array(zod.string()).optional(),
});

module.exports = { createEvent, updateEvent };
