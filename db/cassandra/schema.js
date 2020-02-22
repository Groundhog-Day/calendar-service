const cassandra = require('cassandra-driver');
 
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc'
});
 
const dropTableQuery = 'DROP TABLE IF EXISTS calendar';
const createTableQuery =
  `CREATE TABLE calendar (
    id int,
    address ASCII,
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
    minCostPerNight SMALLINT,
    maxCostPerNight SMALLINT,
    serviceFee TINYINT,
    cleaningFee TINYINT,
    occupancyTax FLOAT,
    client_username TEXT,
    startDate DATE,
    endDate DATE,
    adults TINYINT,
    children TINYINT,
    infants TINYINT,
    paid BOOLEAN,
    PRIMARY KEY (id, startDate)
  )`;


client.execute(dropTableQuery)
  .then(() => ( client.execute(createTableQuery) ))
  .then((result) => {
    client.shutdown();
  })
  .catch((err) => {
    console.log(err);
    client.shutdown();
  })

