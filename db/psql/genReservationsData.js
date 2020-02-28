// (sub)modules to connect with psql
const { Client } = require('pg');
const client = new Client({
  user: 'ubuntu',
  host: 'localhost',
  database: 'ubuntu',
  password: 'hrsf125_ak',
  port: 5432
});
const copyFrom = require('pg-copy-streams').from;

// (sub)modules to generate fake data and write into csv file
const faker = require('faker');
const fs = require('fs');
const path = require('path');

/*  
  START: Declare Helper Functions
*/
const generate1k = (ind1, ind2, callback) => { // generate 0~10 reservation for each of 10 accomodations
  // create a file and write header
  const fileName = path.join(__dirname, `reservations${ind2}.csv`);
  fs.writeFileSync(fileName, 'accomodation_id,user_id,startDate,endDate,adults,children,infants,paid\n');

  // create variables needed to generate fake data and write into csv file
  const dataLimit = (10 ** 3);          // 1k
  const stringLengthLimit = (2 ** 20);  // MDN says different browser has different length limit, and the minimum is (2 ** 27 - 1)
  let tempString = '';

  for (let i = 0; i < dataLimit; i++) {
    // generate fake data
    let accomodation_id = (ind1 * (dataLimit * 10)) + (ind2 * dataLimit) + i + 1; // 10k digit + 1k digit + rest of digits
    let user_id = 0;
    let startDate = '1970-01-01';
    let endDate = '1970-01-01';
    let adults = 0;
    let children = 0;
    let infants = 0;
    let paid = false;


    // generate random number of reservations with random dates
    let numReservations = Math.ceil(Math.random() * 10);
    if(numReservations > 0) {
      let dateTracker = new Date();

      for (let j=0; j < numReservations; j++) {
        let user_id = Math.ceil(Math.random() * 24 * (10 * 6));

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
        tempString += `${accomodation_id},${user_id},${startDate},${endDate},${adults},${children},${infants},${paid}\n`;
      }
    } else {
      tempString += `${accomodation_id},${user_id},${startDate},${endDate},${adults},${children},${infants},${paid}\n`;
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
      // initiate pg-copy-stream
      let stream = client.query(copyFrom('COPY reservations FROM STDIN WITH CSV HEADER'));
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


const generate10k = (ind1, callback) => {
  let bound = 10;
  let count = 0;

  for(let ind2 = 0; ind2 < bound; ind2++) {
    generate1k(ind1, ind2, () => {
      count++;
      if (count === bound) {
        callback();
      }
    });
  }
}


let count100k = 0; // tracks how many data in million are generated
let generateUpTo = 1000; // decides the upper limit of how many data in million are generated

const reinvokeGen10k = () => {
  count100k++;
  if (count100k !== generateUpTo) {
    generate10k(count100k, reinvokeGen10k);
  } else {
    client.query('ALTER TABLE reservations ADD CONSTRAINT constraint_fk1 FOREIGN KEY (accomodation_id) REFERENCES accomodations(id) ON DELETE CASCADE')
      .then(() => (
        client.query('ALTER TABLE reservations ADD CONSTRAINT constraint_fk2 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE')
      ))
      .then(() => (
        client.query('CREATE INDEX res_index ON reservations (accomodation_id)')
      ))
      .catch((e) => {
        console.log('error in adding foreign key constraints of or creating index on reservations table');
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

generate10k(count100k, reinvokeGen10k);