const mongoose = require('mongoose');
const moment = require('moment');

mongoose.connect("mongodb://localhost/airBnbSchedulings", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("CONNECTION ESTABLISHED"));

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
  maxGuests: Number,
  reservedDates: [String],
  cleaningFee: Number,
  serviceFee: Number,
  occupancyFee: Number
});

// let Reservation = mongoose.model("Reservation", reservationSchema);
let Accommodation = mongoose.model("Accommodation", accommodationSchema);

//////// CLEARS DB COLLECTION
// Accommodation.deleteMany((err, accs) => {});

// // // SEEDER
// for (let i = 0; i < 100; i++) {
//   let dates = [];

//   const makeDates = () => {
//     let reservedDates = [];
//     let day = Math.floor(Math.random() * Math.floor(30));
//     let month = Math.floor(Math.random() * Math.floor(6));
//     let twoOrThree = Math.floor(Math.random() * Math.floor(12));

//     for (let i=0; i<twoOrThree; i++) {
//       dates.push(moment(new Date(2020, month, day + i)).format('L'));
//     }
//     return reservedDates;
//   }

//   for (let d=0; d<25; d++) {
//     makeDates();
//   }

//   let accommodation = new Accommodation({
//     accommodationId: i,
//     costPerNight: [99,89,79,110,99,149,199,299,89,119][Math.floor(Math.random() * Math.floor(9))],
//     reviewsCount: Math.round(Math.random() * Math.floor(500)),
//     ratingScore: (4 + Math.random(5)).toFixed(2),
//     reservedDates: dates,
//     maxGuests: [3,4,5,6,7][Math.floor(Math.random() * Math.floor(5))],
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
// }

// DB HELPERS FOR API REQUESTS
const retrieveCollection = cb => {
  Accommodation.find((err, accommodations) => {
    if (err) {
      return err;
    }
    cb(accommodations);
  });
};

module.exports = {
  retrieveCollection
}