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
  reservedDates: [Number],
  cleaningFee: Number,
  serviceFee: Number,
  occupancyFee: Number
});

let Reservation = mongoose.model("Reservation", reservationSchema);
let Accommodation = mongoose.model("Accommodation", accommodationSchema);

//////// CLEARS DB COLLECTION
Accommodation.deleteMany((err, accs) => {});

// SEEDER
for (let i = 0; i < 100; i++) {
  let dates = [];

  const makeDate = () => {
    let month = [100,200,300,400,500,600];
    let days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    return month[Math.floor(Math.random() * Math.floor(6))] + days[Math.floor(Math.random() * Math.floor(30))];
  };

  for (let d=0; d<10; d++) {
    let date = makeDate();
    dates.push(date, date + 1, date + 2);
  }

  let accommodation = new Accommodation({
    accommodationId: i,
    costPerNight: [99,89,79,110,99,149,199,299,89,119][Math.floor(Math.random() * Math.floor(9))],
    reviewsCount: Math.round(Math.random() * Math.floor(500)),
    ratingScore: (4 + Math.random(5)).toFixed(2),
    reservedDates: dates,
    cleaningFee: [29,39,59][Math.floor(Math.random() * Math.floor(3))],
    serviceFee: [19,29][Math.floor(Math.random() * Math.floor(2))],
    occupancyFee: [19,29][Math.floor(Math.random() * Math.floor(2))],
  });

  accommodation.save((err, accommodation) => {
    if (err) {
      console.log('error: ', err);
    }
    console.log(accommodation.accommodationId + ' has successfully been added')
  })
};

// DB HELPERS FOR API REQUESTS
const retrieveCollection = cb => {
  Accommodation.find((err, accommodations) => {
    if (err) return err;
    cb(accommodations);
  });
};

module.exports = {
  retrieveCollection
}