const { Client } = require('pg');
const client = new Client();
const copyFrom = require('pg-copy-streams').from;

const faker = require('faker');
const fs = require('fs');
const path = require('path');


const gen1MUserData = (index, callback) => {
  // create file and write header
  const fileName = path.join(__dirname, `users${index}.csv`);
  fs.writeFileSync(fileName, 'id, username, name, email, about, location, work\n');

  // create variables needed to generate fake data
  const dataLimit = (10 ** 6);
  const stringLengthLimit = (2 ** 25);
  let tempString = '';


  for (let i = 0; i < dataLimit; i++) {
    // generate fake data
    let decider = Math.random();

    let id = i;
    let username = faker.internet.userName();
    let name = faker.name.findName();
    let email = faker.internet.email();
    let about = (decider < 0.95) ? '""' : faker.lorem.sentence();

    let location = (decider < 0.8) ? '""' : faker.fake("{{address.streetAddress}}, {{address.city}}, {{address.country}}");
    location = location.replace(/,/g, '');

    let work = (decider < 0.8) ? '""' : faker.fake("{{name.jobTitle}} at {{company.suffixes}}");
    work = work.replace(/,/g, '');

    // add generated fake data to temp string
    tempString += `${id}, ${username}, ${name}, ${email}, ${about}, ${location}, ${work}\n`;

    // append to the file at every 100K data generation
    if ( i % (dataLimit / 10) === 99999) {
      fs.appendFile(fileName, tempString, (err) => {
        if(err) {
          console.log(err);
        } else {
          tempString = '';

          // copy to the database if the loop reached to the end, and delete the file
          if(i === dataLimit - 1) {
            let stream = client.query(copyFrom('COPY users FROM STDIN WITH CSV HEADER'));
            let fileStream = fs.createReadStream(fileName);

            fileStream.on('error', (err) => console.log('Error in Reading: ', err));
            stream.on('error', (err) => console.log('Error in Copying: ', err));
            stream.on('end', () => {
              fs.unlink(fileName, (err) => {
                if (err) throw err;
                callback();
              });
            });
            fileStream.pipe(stream);      
          }
        }
      });
    }
  }
}

let user1M = 0;
let userDataMax = 10; // generate 1M * 24 = 24M data

client.connect();

for(let i=0; i<userDataMax; i++) {
  gen1MUserData(i, () => {
    user1M++;
    if (user1M === userDataMax) {
      console.log('Done Copying');
      client.end();
    }
  });
}





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