// (sub)modules to connect with psql
const { Client } = require('pg');
const client = new Client();
const copyFrom = require('pg-copy-streams').from;

// (sub)modules to generate fake data and write into csv file
const faker = require('faker');
const fs = require('fs');
const path = require('path');

/*  
  START: Declare Helper Functions
*/
const generate100k = (ind1, ind2, callback) => {
  // create a file and write header
  const fileName = path.join(__dirname, `accomodations${ind2}.csv`);
  fs.writeFileSync(fileName, 'host, joinDate, address, city, bedroom, bed, baths, maxGuests, minDaysStay, checkInHour, checkOutHour, amenities, houseRules, cancelationPolicy, reviewCount, ratingScore, minCostPerNight, maxCostPerNight, serviceFee, cleaningee, occupancyTax\n');

  // create variables needed to generate fake data and write into csv file
  const dataLimit = (10 ** 5);          // 100k
  const stringLengthLimit = (2 ** 25);  // MDN says different browser has different length limit, and the minimum is (2 ** 27 - 1)
  let tempString = '';


  for (let i = 0; i < dataLimit; i++) {
    // generate fake data
    /**********************************************************************************
    CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS

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

    CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS
    **********************************************************************************/

    /**********************************************************************************
    CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS
      // add generated fake data to temp string
      tempString += ``;


    CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS
    **********************************************************************************/

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
      let stream = client.query(copyFrom('COPY accomodations FROM STDIN WITH CSV HEADER'));
      let fileStream = fs.createReadStream(fileName);

      // event(?) listner 
      fileStream.on('error', (err) => console.log('Error in Reading: ', err));
      stream.on('error', (err) => console.log('Error in Copying: ', err));
      stream.on('end', () => { // upon copying data, delete csv file
        fs.unlink(fileName, (err) => {
          if (err) throw err;
          callback();
        });
      });

      // pipe everything described above
      fileStream.pipe(stream);
    }
  }
}


const generate1M = (ind1, callback) => {
  let bound = 10;
  let count = 0;

  for(let ind2 = 0; ind2 < bound; ind2++) {
    generate100k(ind1, ind2, () => {
      count++;
      if (count === 10) {
        callback();
      }
    });
  }
}


let countMillion = 0; // tracks how many data in million are generated
/**********************************************************************************
CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS

let generateUpTo = 10; // decides the upper limit of how many data in million are generated

CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS CHANGE THIS
**********************************************************************************/

const reinvokeGen1M = () => {
  countMillion++;
  if (countMillion !== generateUpTo) {
    generate1M(countMillion, reinvokeGen1M);
  } else {
    client.end();
  }
}
/*  
  END: Declare Helper Functions
*/


client.connect(); // connect to psql server

client.query('DROP TABLE IF EXISTS accomodations CASCADE') // drop table to delete all previously save data
  .then( () => (   // create table again without constraints (constraints are neglected to use 'copy' method)
    client.query(
      `CREATE TABLE users (
        id INTEGER NOT NULL,
        username VARCHAR(100),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(50) NOT NULL,
        about VARCHAR(150),
        location VARCHAR(100),
        work VARCHAR(100)
      )`)))
  .catch( (e) => {
    console.log('error in dropping or creating accomodations tables');
    console.error(e);
    client.end();
  })
  .then( () => {
    generate1M(countMillion, reinvokeGen1M);    
  });


/* PRIMARY DATA: Accomodation

*/