const { Client } = require('pg');
const client = new Client();

client.connect();

// drop all tables initally
client.query('DROP TABLE IF EXISTS reservations CASCADE')
  .then(() => (
    client.query('DROP TABLE IF EXISTS occupancyTaxes')
  ))
  .catch( (e) => {
    console.log('Error in dropping any of the tables');
    console.error(e);
    client.end();
  })
  .then( () => (
    client.query(`CREATE TABLE reservations (
          id INTEGER,
          accomodation INTEGER,
          username INTEGER,
          startDate CHAR(6),
          endDate CHAR(6),
          adults SMALLINT,
          children SMALLINT,
          infants SMALLINT,
          paid BOOLEAN
        )`)))
  .then( () => (
    client.query(`CREATE TABLE occupancyTaxes (
          id SMALLINT,
          county VARCHAR(15),
          taxPercentage  numeric(2,1)
        )`)))
  .catch( (e) => {
    console.log('Error in creating any of the tables');
    console.error(e);
  })
  .then(() => {
    client.end();
  });
// REFERENCES so_headers(id)

/*
  
  
*/