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
const generate50k = (ind1, ind2, callback) => {
  // create a file and write header
  const fileName = path.join(__dirname, `accomodations${ind2}.csv`);
  fs.writeFileSync(fileName, 'id,hostUser,address,bedroom,bed,baths,maxGuests,minDaysStay,checkInHour,checkOutHour,amenities,houseRules,cancelationPolicy,reviewCount,ratingScore,minCostPerNight,maxCostPerNight,serviceFee,cleaningFee,occupancyTax\n');

  // create variables needed to generate fake data and write into csv file
  const dataLimit = 5 * (10 ** 4);      // 50k
  const stringLengthLimit = (2 ** 25);  // MDN says different browser has different length limit, and the minimum is (2 ** 27 - 1)
  let tempString = '';


  for (let i = 0; i < dataLimit; i++) {
    // generate fake data
    let id = (ind1 * (dataLimit * 10)) + (ind2 * dataLimit) + i + 1; // #500k + #50k + rest of digits;

    let hostUser = Math.ceil(Math.random() * 24 * (10 * 6));

    let address = faker.address.streetAddress();
    address = address.replace(/,/g, ''); // cannot escape , somehow so just delete commas

    let randNum = Math.random();
    let bedroom = randNum < 0.6 ? 1 : randNum < 0.8 ? 2 : 3;
    let bed = Math.random < 0.90 ? bedroom : bedroom + 1;
    let baths = randNum < 0.70 ? 1.0 : randNum < 0.9 ? 1.5 : 2.0;
    let maxGuests = bed * (randNum < 0.3 ? 1 : 2);

    let minDaysStay = Math.random() < 0.9 ? 1 : 2;
    let checkInHour = ['02:00 PM', '02:30 PM', '03:30 PM'][Math.floor(Math.random() * 3)];
    let checkOutHour = ['10:00 AM', '10:30 AM', '11:00 AM'][Math.floor(Math.random() * 3)];;
    let amenities = (Math.floor(Math.random() * 256).toString(2)).padStart(8, '0');
    let houseRules = (Math.floor(Math.random() * 256).toString(2)).padStart(8, '0');
    let cancelationPolicy = faker.lorem.sentence() + (Math.random() < 0.7 ? '': ' ' + faker.lorem.sentence());

    let reviewCount = 70 + Math.ceil(Math.random() * 350);
    let ratingScore = parseFloat((3 + Math.random() * 2).toFixed(2));

    let minCostPerNight = [80, 85, 89, 90, 95, 99, 100, 105, 109, 109, 110][Math.floor(Math.random() * 10)];
    let maxCostPerNight = minCostPerNight + (Math.random() < 0.5 ? 25 : 30);
    let serviceFee = [25, 29, 39][Math.floor(Math.random() * 3)];
    let cleaningFee = [29, 39, 49][Math.floor(Math.random() * 3)];
    let occupancyTax = 5 + Math.ceil(Math.random()*7) + (Math.random() < 0.8 ? 0 : 0.5);

    // add generated fake data to temp string
    tempString += `${id},${hostUser},${address},${bedroom},${bed},${baths},${maxGuests},${minDaysStay},${checkInHour},${checkOutHour},${amenities},${houseRules},${cancelationPolicy},${reviewCount},${ratingScore},${minCostPerNight},${maxCostPerNight},${serviceFee},${cleaningFee},${occupancyTax}\n`;

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


const generate500k = (ind1, callback) => {
  let bound = 10;
  let count = 0;

  for(let ind2 = 0; ind2 < bound; ind2++) {
    generate50k(ind1, ind2, () => {
      count++;
      if (count === 10) {
        callback();
      }
    });
  }
}


let countMillion = 0; // tracks how many data in million are generated
let generateUpTo = 20; // decides the upper limit of how many data in million are generated

const reinvokeGen500k = () => {
  countMillion++;
  if (countMillion !== generateUpTo) {
    generate500k(countMillion, reinvokeGen500k);
  } else {
    client.query('ALTER TABLE accomodations ADD PRIMARY KEY (id)')
      .then(() => (
        client.query('ALTER TABLE accomodations ADD CONSTRAINT constraint_fk FOREIGN KEY (hostuser) REFERENCES users(id) ON DELETE CASCADE')
      ))
      .catch((e) => {
        console.log('error in adding primary key or foreign key on reservations table');
        console.error(e);
      })
      .then(()=> {
        client.end();
      })
  }
}
/*  
  END: Declare Helper Functions
*/



client.connect(); // connect to psql server

client.query('DROP TABLE IF EXISTS accomodations CASCADE') // drop table to delete all previously save data
  .then( () => (   // create table again without constraints (constraints are neglected to use 'copy' method)
    client.query(`CREATE TABLE accomodations (
      id INTEGER,
      hostUser INTEGER,
      address VARCHAR(50),
      bedroom SMALLINT,
      bed SMALLINT,
      baths numeric(2,1),
      maxGuests SMALLINT,
      minDaysStay SMALLINT,
      checkInHour TIME,
      checkOutHour TIME,
      amenities bit(8),
      houseRules bit(8),
      cancelationPolicy VARCHAR(300),
      reviewCount SMALLINT,
      ratingScore numeric(3,2),
      minCostPerNight SMALLINT,
      maxCostPerNight SMALLINT,
      serviceFee SMALLINT,
      cleaningFee SMALLINT,
      occupancyTax numeric(3,1)
    )`)))
  .catch( (e) => {
    console.log('error in dropping or creating accomodations table');
    console.error(e);
    client.end();
  })
  .then( () => {
    generate500k(countMillion, reinvokeGen500k);    
  });
