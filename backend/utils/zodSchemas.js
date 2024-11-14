// Zod schema
const zod = require("zod");

const createEvent = zod.object({
    title: zod.string().nonempty("Title is required"),
    description: zod.string().nonempty("Description is required"),
    date: zod.string().nonempty("Set a Date"),
    time: zod.string().nonempty("Enter the time"),
    labels: zod.array(zod.string()).optional(),
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
