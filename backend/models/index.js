const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

// A User can make many Bookings
User.hasMany(Booking);
Booking.belongsTo(User);

// An Event can have many Bookings
Event.hasMany(Booking);
Booking.belongsTo(Event);