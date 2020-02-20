const cassandra = require('cassandra-driver');

const faker = require('faker');
const path = require('path');
const fs = require('fs');
 
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc'
});
 
const dropTableQuery = 'DROP TABLE IF EXISTS calendar'
const createTableQuery =
  `CREATE TABLE calendar (
    id int,
    address ASCII PRIMARY KEY,
    bedroom TINYINT,
    bed TINYINT,
    baths TINYINT,
    maxGuests TINYINT,
    minDayStaty TINYINT,
    checkInHour TIME, 
    checkOutHour TIME,
    amenities TEXT,
    houseRules TEXT,
    cancelationPolicy ASCII,
    host_username TEXT,
    host_name TEXT,
    host_email TEXT,
    host_about ASCII,
    host_location ASCII,
    host_work TEXT,
    reviewCount SMALLINT,
    ratingScore FLOAT,
    minCostPerNight TINYINT,
    maxCostPerNight TINYINT,
    serviceFee TINYINT,
    cleaningFee TINYINT,
    occupancyTax TINYINT,
    client_username TEXT,
    startDate DATE,
    endDate DATE,
    adults TINYINT,
    children TINYINT,
    infants TINYINT,
    paid BOOLEAN
  )`;

const copyQeury = 'COPY '

/*  
  START: Declare Helper Functions
*/
const generate10k = (ind1, ind2, callback) => {
  // create a file and write header
  const fileName = path.join(__dirname, `cql${ind2}.csv`);
  fs.writeFileSync(fileName, 'id,address,bedroom,bed,baths,maxGuests,minDayStaty,checkInHour,checkOutHour,amenities,houseRules,cancelationPolicy,host_username,host_name,host_email,host_about,host_location,host_work,reviewCount,ratingScore,minCostPerNight,maxCostPerNight,serviceFee,cleaningFee,occupancyTax,client_username,startDate,endDate,adults,children,infants,paid\n');
  // create variables needed to generate fake data and write into csv file
  const dataLimit = 1;
  // const dataLimit = (10 ** 4);       // 10k
  const stringLengthLimit = (2 ** 25);  // MDN says different browser has different length limit, and the minimum is (2 ** 27 - 1)
  let tempString = '';


  for (let i = 0; i < dataLimit; i++) {
    // declare variables that will be stored in the db
    let id, address, bedroom, bed, baths, maxGuests, minDayStaty, checkInHour, checkOutHour, amenities, houseRules, cancelationPolicy, host_username, host_name, host_email, host_about, host_location, host_work, reviewCount, ratingScore, minCostPerNight, maxCostPerNight, serviceFee, cleaningFee, occupancyTax, client_username, startDate, endDate, adults, children, infants,paid;


    // generate fake data
    id = (ind1 * (dataLimit * 10)) + (ind2 * dataLimit) + i + 1; // 10k digit + 1k digit + rest of digits;


client_username;
startDate;
endDate;
adults;
children;
infants;
paid;

    address = (faker.address.streetAddress()).replace(/,/g, ''); // cannot escape , somehow so just delete commas

    randNum = Math.random();
    bedroom = randNum < 0.6 ? 1 : randNum < 0.8 ? 2 : 3;
    bed = Math.random < 0.90 ? bedroom : bedroom + 1;
    baths = randNum < 0.70 ? 1.0 : randNum < 0.9 ? 1.5 : 2.0;
    maxGuests = bed * (randNum < 0.3 ? 1 : 2);

    minDaysStay = Math.random() < 0.9 ? 1 : 2;
    checkInHour = ['02:00 PM', '02:30 PM', '03:30 PM'][Math.floor(Math.random() * 3)];
    checkOutHour = ['10:00 AM', '10:30 AM', '11:00 AM'][Math.floor(Math.random() * 3)];;
    amenities = (Math.floor(Math.random() * 256).toString(2)).padStart(8, '0');
    houseRules = (Math.floor(Math.random() * 256).toString(2)).padStart(8, '0');
    cancelationPolicy = faker.lorem.sentence() + (Math.random() < 0.7 ? '': ' ' + faker.lorem.sentence());

    reviewCount = 70 + Math.ceil(Math.random() * 350);
    ratingScore = parseFloat((3 + Math.random() * 2).toFixed(2));

    minCostPerNight = [80, 85, 89, 90, 95, 99, 100, 105, 109, 109, 110][Math.floor(Math.random() * 10)];
    maxCostPerNight = minCostPerNight + (Math.random() < 0.5 ? 25 : 30);
    serviceFee = [25, 29, 39][Math.floor(Math.random() * 3)];
    cleaningFee = [29, 39, 49][Math.floor(Math.random() * 3)];
    occupancyTax = Math.ceil(Math.random() * 100);    

    let decider = Math.random(); // decide whether to have data for some attributes
    host_username = faker.internet.userName();
    host_name = faker.name.findName();
    host_email = faker.internet.email();
    host_about = (decider < 0.95) ? '""' : faker.lorem.sentence();

    host_location = (decider < 0.8) ? '""' : faker.fake("{{address.streetAddress}}, {{address.city}}, {{address.country}}");
    host_location = host_location.replace(/,/g, ''); // cannot escape , somehow so just delete commas

    host_work = (decider < 0.8) ? '""' : faker.fake("{{name.jobTitle}} at {{company.suffixes}}");
    host_work = host_work.replace(/,/g, ''); // cannot escape , somehow so just delete commas

    /*
    if (Math.random() > 0.7) {
      
    }
    */

    // add generated fake data to temp string
    tempString += `${id},${address},${bedroom},${bed},${baths},${maxGuests},${minDayStaty},${checkInHour},${checkOutHour},${amenities},${houseRules},${cancelationPolicy},${host_username},${host_name},${host_email},${host_about},${host_location},${host_work},${reviewCount},${ratingScore},${minCostPerNight},${maxCostPerNight},${serviceFee},${cleaningFee},${occupancyTax},${client_username},${startDate},${endDate},${adults},${children},${infants},${paid}\n`;

    // if either temp string is too long or the loop reached to the end, append to the file
    if(tempString.length > stringLengthLimit || i === dataLimit - 1) {
      fs.appendFile(fileName, tempString, (err) => {
        if(err) {
          console.log(err);
        } else {
          tempString = '';
        }
      });
    }

    // copy to the database if the data generation loop reached to the end
    if(i === dataLimit - 1) {
      // initiate pg-copy-stream

    }
  }
}


const generate100k = (ind1, callback) => {
  let bound = 10;
  let count = 0;

  for(let ind2 = 0; ind2 < bound; ind2++) {
    generate10k(ind1, ind2, () => {
      count++;
      if (count === 10) {
        callback();
      }
    });
  }
}


let countMillion = 0; // tracks how many data in million are generated
let generateUpTo = 1; // decides the upper limit of how many data in million are generated

const reinvokeGen100k = () => {
  countMillion++;
  if (countMillion !== generateUpTo) {
    generate100k(countMillion, reinvokeGen100k);
  } else {
    client.end();
  }
}
/*  
  END: Declare Helper Functions
*/

generate100k(countMillion, reinvokeGen100k);
/*
client.execute(dropTableQuery)
  .then(() => ( client.execute(createTableQuery) ))
  .then((result) => {
    console.log(result);
    client.shutdown();
  })
  .catch((err) => {
    console.log(err);
    client.shutdown();
  })
*/
