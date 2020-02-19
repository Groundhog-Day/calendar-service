const { Client } = require('pg');
const client = new Client();
const copyFrom = require('pg-copy-streams').from;

const faker = require('faker');
const fs = require('fs');
const path = require('path');

/* PRIMARY DATA: Accomodation
const writeTo = path.join(__dirname, 'accomodation.csv');
fs.writeFileSync(writeTo, 'host, joinDate, address, city, bedroom, bed, baths, maxGuests, minDaysStay, checkInHour, checkOutHour, amenities, houseRules, cancelationPolicy, reviewCount, ratingScore, minCostPerNight, maxCostPerNight, serviceFee, cleaningee, occupancyTax\n');

fs.appendFile(writeTo, `asdf, 123119, 44 Tehma Street, San Francisco, 2, 2, 1, 4, 1, 02:30 PM, 11:00 AM, 11111111, 01010101, blahblahblah, 234, 4.23, 120, 154, 40, 50, 30`, (err) => { 
    if(err) {
      console.log(err);
    }
});

let host = ;
let joinDate = ;
const randNum = Math.random;
let address = faker.address.streetAddress();
let city = faker.address.county;
let bedroom = randNum < 0.6 ? 1 : randNum < 0.8 ? 2 : randNum < 0.95 ? 3 : 4;
let bed ;
let baths = randNum < 0.95 ? 1 : 2;
let maxGuests = bed + (randNum < 0.25 ? 1 : ;
let minDaysStay = randNum < 0;
let checkInHour;
let checkOutHour;
let amenities = Math.floor(randNum * 256).toString(2);
let houseRules;
let cancelationPolicy;
let reviewCount;
let ratingScore;
let minCostPerNight;
let maxCostPerNight;
let serviceFee;
let cleaningee;
let occupancyTax;
*/