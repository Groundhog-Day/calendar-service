const { Client } = require('pg');
const client = new Client();

client.connect()
  .then(() => console.log('Connected to PostgreSQL'));

const postReservation = (accomodation_id, data, callback) => {
  let {user_id, startDate, endDate, adults, children, infants, paid} = data;
  
  const postQuery = {
    text: 'INSERT INTO reservations (accomodation_id, user_id, startDate, endDate, adults, children, infants, paid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    values: [accomodation_id, user_id, startDate, endDate, adults, children, infants, paid]
  }

  client.query(postQuery, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

const getAccomodation = (id, callback) => {
  client.query(`SELECT * FROM accomodations INNER JOIN reservations on (accomodations.id = reservations.accomodation_id) WHERE accomodations.id=${id}`)
    .then((result) => {
      callback(null, result.rows);
    })
    .catch((err) => {
      callback(err, null);
    });
};

const getCost = (id, callback) => {
  client.query(`SELECT minCostPerNight, maxCostPernight, serviceFee, cleaningFee, occupancyTax FROM accomodations where id=${id}`)
    .then((result) => {
      callback(null, result.rows[0]);
    })
    .catch((err) => {
      callback(err, null);
    });
};

const putReservation = (id, newData, callback) => {
  callback();
};

const deleteReservation = (accomodation_id, user_id, startDate, callback) => {
  const deleteQuery = {
    text: 'DELETE FROM reservations WHERE accomodation_id=$1 AND user_id=$2 AND startDate=$3',
    values: [accomodation_id, user_id, startDate]
  }

  client.query(deleteQuery, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

module.exports = {
  'postReservation': postReservation,
  'getAccomodation': getAccomodation,
  'getCost': getCost,
  'putReservation': putReservation,
  'deleteReservation': deleteReservation
}