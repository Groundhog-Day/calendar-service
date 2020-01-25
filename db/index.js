const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/airBnbSchedulings", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("CONNECTION ESTABLISHED BLEEP BLOOP"));

let reservationSchema = new mongoose.Schema({
  accommodationId: Number,
  startDate: Date,
  endDate: Date,
  adults: Number,
  children: Number,
  infants: Number,
  totalCost: Number,
  cleaningFee: Number,
  serviceFee: Number,
  occupancyFee: Number
});

let accommodationSchema = new mongoose.Schema({
  accommodationId: Number,
  costPerNight: Number,
  reviewsCount: Number,
  ratingScore: Number,
  cleaningFee: Number,
  serviceFee: Number,
  occupancyFee: Number
});

let Reservation = mongoose.model("Reservation", reservationSchema);
let Accommodation = mongoose.model("Accommodation", accommodationSchema);

//////// clears db collection of all rows and seeds accommodations
// Accommodation.deleteMany((err, accs) => {});


// seeds collection with rows
// for (let i = 0; i < 100; i++) {
//   let accommodation = new Accommodation({
//     accommodationId: i,
//     costPerNight: [99, 89, 79, 110, 99, 149, 199, 299, 89, 119][Math.floor(Math.random() * Math.floor(9))],
//     reviewsCount: Math.round(Math.random() * Math.floor(500)),
//     ratingScore: (4 + Math.random(5)).toFixed(2),
//     cleaningFee: [29,39,59][Math.floor(Math.random() * Math.floor(3))],
//     serviceFee: [19,29][Math.floor(Math.random() * Math.floor(2))],
//     occupancyFee: [19,29][Math.floor(Math.random() * Math.floor(2))],
//   });

//   accommodation.save((err, accommodation) => {
//     if (err) {
//       console.log('error: ', err);
//     }
//     console.log(accommodation.accommodationId + ' has successfully been added')
//   })
// };


const retrieveCollection = cb => {
  Accommodation.find((err, accommodations) => {
    if (err) return err;
    cb(accommodations);
  });
};

module.exports = {
  retrieveCollection
}