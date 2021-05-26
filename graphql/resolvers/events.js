const Event = require("../../models/event");
const User = require("../../models/user");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate({
        path: "creator",
        populate: {
          path: "createdEvents",
        },
      });

      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
          creator: {
            ...event._doc.creator._doc,
          },
        };
      });
    } catch (error) {
      console.log(err);
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId,
      });

      let createdEvent;

      const eventSave = await event.save();

      createdEvent = { ...eventSave._doc };
      const user = await User.findById(req.userId);

      if (!user) {
        throw new Error("user not found");
      }
      user.createdEvents.push(event);
      await user.save();

      return createdEvent;
    } catch (error) {
      console.log(error);
    }
  },
};
