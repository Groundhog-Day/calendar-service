// (sub)modules to connect with psql
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
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
const generate100k = (ind1, ind2, callback) => {
  // create a file and write header
  const fileName = path.join(__dirname, `users${ind2}.csv`);
  fs.writeFileSync(fileName, 'id,username,name,email,about,location,work\n');

  // create variables needed to generate fake data and write into csv file
  const dataLimit = (10 ** 4);          // 100k
  const stringLengthLimit = (2 ** 25);  // MDN says different browser has different length limit, and the minimum is (2 ** 27 - 1)
  let tempString = '';


  for (let i = 0; i < dataLimit; i++) {
    // generate fake data
    let decider = Math.random(); // decide whether to have data for some attributes

    let id = (ind1 * (dataLimit * 10)) + (ind2 * dataLimit) + i + 1; // 1M digit + 100k digit + rest of digits
    let username = faker.internet.userName();
    let name = faker.name.findName();
    let email = faker.internet.email();
    let about = (decider < 0.95) ? '""' : faker.lorem.sentence();

    let location = (decider < 0.8) ? '""' : faker.fake("{{address.streetAddress}} {{address.city}} {{address.country}}");
    // location = location.replace(/,/g, ''); // cannot escape , somehow so just delete commas

    let work = (decider < 0.8) ? '""' : faker.fake("{{name.jobTitle}} at {{company.suffixes}}");
    // work = work.replace(/,/g, ''); // cannot escape , somehow so just delete commas


    // add generated fake data to temp string
    tempString += `${id}|${username}|${name}|${email}|${about}|${location}|${work}\n`;


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
      let stream = client.query(copyFrom('COPY users FROM STDIN WITH CSV HEADER'));
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
let generateUpTo = 240; // decides the upper limit of how many data in million are generated

const reinvokeGen1M = () => {
  countMillion++;
  if (countMillion !== generateUpTo) {
    generate1M(countMillion, reinvokeGen1M);
  } else {
    client.query('ALTER TABLE users ADD PRIMARY KEY (id)')
      .catch((e) => {
        console.log('error in adding primary key on users table');
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

generate1M(countMillion, reinvokeGen1M);
/*
client.query('DROP TABLE IF EXISTS users CASCADE') // drop table to delete all previously save data
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
    console.log('error in dropping or creating users table');
    console.error(e);
    client.end();
  })
  .then( () => {
    generate1M(countMillion, reinvokeGen1M);
  });
*/