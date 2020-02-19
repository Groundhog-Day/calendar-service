const { Client } = require('pg');
const client = new Client();

client.connect();

// drop all tables initally
client.query('DROP TABLE IF EXISTS users CASCADE')
  .then(() => (
    client.query('DROP TABLE IF EXISTS accomodations CASCADE')
  ))
  .then(() => (
    client.query('DROP TABLE IF EXISTS reservations CASCADE')
  ))
  .then(() => (
    client.query('DROP TABLE IF EXISTS occupancyTaxes')
  ))
  .catch( (e) => {
    console.log('Error in dropping any of the tables');
    console.error(e);
    client.end();
  })
  .then( () => (   // create all tables
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
  .then( () => (
    client.query(`CREATE TABLE accomodations (
          id INTEGER,
          hostUser INTEGER,
          joinDate CHAR(6),
          address VARCHAR(50),
          city VARCHAR(30),
          bedroom SMALLINT,
          bed SMALLINT,
          baths numeric(2,1),
          maxGuests SMALLINT,
          minDaysStay SMALLINT,
          checkInHour CHAR(8),
          checkOutHour CHAR(8),
          amenities bit(8),
          houseRules bit(8),
          cancelationPolicy VARCHAR(100),
          reviewCount SMALLINT,
          ratingScore numeric(2,1),
          minCostPerNight SMALLINT,
          maxCostPerNight SMALLINT,
          serviceFee SMALLINT,
          cleaningee SMALLINT,
          occupancyTax SMALLINT
        )`)))
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