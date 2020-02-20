const cassandra = require('cassandra-driver');
 
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc'
});
 
const dropTableQuery = 'DROP TABLE IF EXISTS calendar'
const createTableQuery =
  `CREATE TABLE calendar (
    id int,
    username TEXT,
    name TEXT,
    email TEXT,
    about ASCII,
    location ASCII,
    work TEXT,
    accomodationAddress ASCII PRIMARY KEY,
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
    reviewCount SMALLINT,
    ratingScore FLOAT,
    minCostPerNight TINYINT,
    maxCostPerNight TINYINT,
    serviceFee TINYINT,
    cleaningFee TINYINT,
    occupancyTax TINYINT,
    clientUser TEXT,
    startDate DATE,
    endDate DATE,
    adults TINYINT,
    children TINYINT,
    infants TINYINT,
    paid BOOLEAN
  )`;
let id;
let host_username;
let host_name;
let host_email;
let host_about;
let host_location;
let host_work;
let accomodationAddress;
let bedroom;
let bed;
let baths;
let maxGuests;
let minDayStaty;
let checkInHour;
let checkOutHour;
let amenities;
let houseRules;
let cancelationPolicy;
let reviewCount;
let ratingScore;
let minCostPerNight;
let maxCostPerNight;
let serviceFee;
let cleaningFee;
let occupancyTax;
let clientUser;
let startDate;
let endDate;
let adults;
let children;
let infants;
let paid;
`${id},${host_username},${host_name},${host_email},${host_about},${host_location},${host_work},${accomodationAddress},${bedroom},${bed},${baths},${maxGuests},${minDayStaty},${checkInHour},${checkOutHour},${amenities},${houseRules},${cancelationPolicy},${reviewCount},${ratingScore},${minCostPerNight},${maxCostPerNight},${serviceFee},${cleaningFee},${occupancyTax},${clientUser},${startDate},${endDate},${adults},${children},${infants},${paid}`

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

