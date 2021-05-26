const Booking = require("../../models/booking");
const Event = require("../../models/event");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const bookings = await Booking.find().populate("event").populate("user");
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          event: booking.event._doc,
          user: booking.user._doc,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const event = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: "60accd136c3c5f2740a1550e",
        event: event,
      });

      const result = await booking.save();
      return {
        ...result._doc,
        id: result.id,
        event: result.event._doc,
        user: result.user._doc,
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      };
    } catch (error) {}
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate({
        path: "event",
        populate: { path: "creator" },
      });
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: booking.event._doc.creator,
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      console.log(error);
    }
  },
};
