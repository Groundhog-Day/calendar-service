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
    baths float,
    maxGuests TINYINT,
    minDaysStay TINYINT,
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
    occupancyTax FLOAT,
    client_username TEXT,
    startDate DATE,
    endDate DATE,
    adults TINYINT,
    children TINYINT,
    infants TINYINT,
    paid BOOLEAN
  )`;

const copyQeury = 'COPY calendar FROM ? WITH DELIMITER "|" AND HEADER=TRUE'

/*  
  START: Declare Helper Functions
*/
const generate10k = (ind1, ind2, callback) => {
  // create a file and write header
  const fileName = path.join(__dirname, `cql${ind2}.csv`);
  fs.writeFileSync(fileName, 'address,adults,amenities,baths,bed,bedroom,cancelationPolicy,checkInHour,checkOutHour,children,cleaningFee,client_username,endDate,host_about,host_email,host_location,host_name,host_username,host_work,houseRules,id,infants,maxCostPerNight,maxGuests,minCostPerNight,minDaysStay,occupancyTax,paid,ratingScore,reviewCount,serviceFee,startDate\n');
  // create variables needed to generate fake data and write into csv file
  const dataLimit = 20;
  // const dataLimit = (10 ** 4);       // 10k
  const stringLengthLimit = (2 ** 25);  // MDN says different browser has different length limit, and the minimum is (2 ** 27 - 1)
  let tempString = '';


  for (let i = 0; i < dataLimit; i++) {
    // declare variables that will be stored in the db
    let id, address, bedroom, bed, baths, maxGuests, minDaysStay, checkInHour, checkOutHour, amenities, houseRules, cancelationPolicy, host_username, host_name, host_email, host_about, host_location, host_work, reviewCount, ratingScore, minCostPerNight, maxCostPerNight, serviceFee, cleaningFee, occupancyTax, client_username, startDate, endDate, adults, children, infants,paid;
    client_username = '';
    startDate = '1970-01-01';
    endDate = '1970-01-01';
    adults = 0;
    children = 0;
    infants = 0;
    paid = false;


    // generate fake data
    id = (ind1 * (dataLimit * 10)) + (ind2 * dataLimit) + i + 1; // 10k digit + 1k digit + rest of digits;
    
    // address = (faker.address.streetAddress()).replace(/,/g, ''); // cannot escape , somehow so just delete commas
    address = faker.address.streetAddress() // cannot escape , somehow so just delete commas

    randNum = Math.random();
    bedroom = randNum < 0.6 ? 1 : randNum < 0.8 ? 2 : 3;
    bed = Math.random < 0.90 ? bedroom : bedroom + 1;
    baths = randNum < 0.70 ? 1.0 : randNum < 0.9 ? 1.5 : 2.0;
    maxGuests = bed * (randNum < 0.3 ? 1 : 2);

    minDaysStay = Math.random() < 0.9 ? 1 : 2;
    checkInHour = ['14:00:00', '14:30:00', '15:30:00'][Math.floor(Math.random() * 3)];
    checkOutHour = ['10:00:00', '10:30:00', '11:00:00'][Math.floor(Math.random() * 3)];;
    amenities = (Math.floor(Math.random() * 256).toString(2)).padStart(8, '0');
    houseRules = (Math.floor(Math.random() * 256).toString(2)).padStart(8, '0');
    cancelationPolicy = faker.lorem.sentence() + (Math.random() < 0.7 ? '': ' ' + faker.lorem.sentence());

    reviewCount = 70 + Math.ceil(Math.random() * 350);
    ratingScore = parseFloat((3 + Math.random() * 2).toFixed(2));

    minCostPerNight = [80, 85, 89, 90, 95, 99, 100, 105, 109, 109, 110][Math.floor(Math.random() * 10)];
    maxCostPerNight = minCostPerNight + (Math.random() < 0.5 ? 25 : 30);
    serviceFee = [25, 29, 39][Math.floor(Math.random() * 3)];
    cleaningFee = [29, 39, 49][Math.floor(Math.random() * 3)];
    occupancyTax = 5 + Math.ceil(Math.random()*7) + (Math.random() < 0.8 ? 0 : 0.5);

    let hostInfDecider = Math.random(); // decide whether to have data for some attributes
    host_username = faker.internet.userName();
    host_name = faker.name.findName();
    host_email = faker.internet.email();
    host_about = (hostInfDecider < 0.95) ? '""' : faker.lorem.sentence();

    host_location = (hostInfDecider < 0.8) ? '""' : faker.fake("{{address.streetAddress}}, {{address.city}}, {{address.country}}");
    host_location = host_location.replace(/,/g, ''); // cannot escape , somehow so just delete commas

    host_work = (hostInfDecider < 0.8) ? '""' : faker.fake("{{name.jobTitle}} at {{company.suffixes}}");
    host_work = host_work.replace(/,/g, ''); // cannot escape , somehow so just delete commas

    let numReservations = Math.floor(Math.random() * 12);
    if(numReservations > 0) {
      let dateTracker = new Date();

      for (let j=0; j < numReservations; j++) {
        let client_username = faker.internet.userName();

        // generate random startDate
        if(j === 0) { // have start date of first reservation within a week from today
          dateTracker.setDate(dateTracker.getDate() + Math.floor(Math.random() * 8));
        } else {      // have start date of second or later reservation within four days from first reservation
          dateTracker.setDate(dateTracker.getDate() + Math.floor(Math.random() * 5));
        }
        //parse startDate into psql's recommended date format
        startDate = `${dateTracker.getFullYear()}-${(dateTracker.getMonth()+1).toString().padStart(2, '0')}-${dateTracker.getDate()}`;

        // generate random endDate and parse
        dateTracker.setDate(dateTracker.getDate() + 1 + Math.floor(Math.random() * 3));
        endDate = `${dateTracker.getFullYear()}-${(dateTracker.getMonth()+1).toString().padStart(2, '0')}-${dateTracker.getDate()}`;

        // generate random number for group member
        adults = 1 + Math.floor(Math.random() * 3);
        children = Math.floor(Math.random() * 4);
        infants = Math.floor(Math.random() * 3);

        // generate random boolean for paying the boolean
        paid = (Math.random() < 0.8);

        // add generated fake data to temp string
        tempString += `${address}|${adults}|${amenities}|${baths}|${bed}|${bedroom}|${cancelationPolicy}|${checkInHour}|${checkOutHour}|${children}|${cleaningFee}|${client_username}|${endDate}|${host_about}|${host_email}|${host_location}|${host_name}|${host_username}|${host_work}|${houseRules}|${id}|${infants}|${maxCostPerNight}|${maxGuests}|${minCostPerNight}|${minDaysStay}|${occupancyTax}|${paid}|${ratingScore}|${reviewCount}|${serviceFee}|${startDate}\n`;
      }
    } else {
      tempString += `${address}|${adults}|${amenities}|${baths}|${bed}|${bedroom}|${cancelationPolicy}|${checkInHour}|${checkOutHour}|${children}|${cleaningFee}|${client_username}|${endDate}|${host_about}|${host_email}|${host_location}|${host_name}|${host_username}|${host_work}|${houseRules}|${id}|${infants}|${maxCostPerNight}|${maxGuests}|${minCostPerNight}|${minDaysStay}|${occupancyTax}|${paid}|${ratingScore}|${reviewCount}|${serviceFee}|${startDate}\n`;
    }


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
      client.execute(copyQeury);
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
    client.shutdown();
  }
}
/*  
  END: Declare Helper Functions
*/

generate100k(countMillion, reinvokeGen100k);

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

