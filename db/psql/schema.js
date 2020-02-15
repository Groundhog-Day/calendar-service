const { Client } = require('pg');
const client = new Client();

client.connect();

let createAccomodationTabe = () => {
  client.query(`CREATE TABLE IF NOT EXISTS accomodation (
      host varchar(16),
      joinDate char(7),
      address varchar(33),
      city varchar(30),
      bedroom smallserial,
      bed smallserial,
      baths numeric(2,1),
      maxGuests smallserial,
      minDaysStay smallserial,
      checkInHour char(9),
      checkOutHour char(9),
      amenities char(9),
      houseRules char(9),
      cancelationPolicy varchar(100),
      reviewCount smallserial,
      ratingScore numeric(2,1),
      minCostPerNight smallserial,
      maxCostPerNight smallserial,
      serviceFee smallserial,
      cleaningee smallserial,
      occupancyTax smallserial
    )`)
    .then(result => console.log(result))
    .catch(e => console.error(e))
    .then(() => client.end());
}
createAccomodationTabe();
