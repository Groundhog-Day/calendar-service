const router = require('express').Router();
const psqlQuery = require('../db/psql/psqlQuery.js');

// CREATE / POST (extension)
router.post('/:id/reservation', (req, res) => {
  let accomodation_id = parseInt(req.originalUrl.match(/(?<=listings\/)(.*)(?=\/reservation)/));

  psqlQuery.postReservation(accomodation_id, req.body, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  })

  // res.send('Under Testing');
});

// READ / GET
router.get('/:id', (req, res) => {
  let id = req.params.id;
  let { startDate, endDate, adults, children} = req.query;
  
  if(!startDate || !endDate || (adults === 0) || (children === undefined)) { // check if any of query parms are missing
    psqlQuery.getAccomodation(id, (err, data) => { // get data about accomodation
      if (err) {
        res.sendStatus(500);
      } else {
        // destruct queried data object
        let id = data[0].id;
        let hostUser = data[0].hostuser;
        let address = data[0].address;
        let bedroom = data[0].bedroom;
        let bed = data[0].bed;
        let baths = parseFloat(data[0].baths);
        let maxGuests = data[0].maxguests;
        let minDaysStay = data[0].mindaysstay;
        let checkInHour = data[0].checkinhour.substring(0,5);
        let checkOutHour = data[0].checkouthour.substring(0,5);
        let amenities = data[0].amenities;
        let houseRules = data[0].houserules;
        let cancelationPolicy = data[0].cancelationpolicy;
        let reviewCount = data[0].reviewcount;
        let ratingScore = parseFloat(data[0].ratingscore);
        let minCostPerNight = data[0].mincostpernight;
        let maxCostPerNight = data[0].maxcostpernight;

        let reservedDates = [];
        for (let i=0; i<data.length; i++) {
          let temp = data[i].startdate.getFullYear() + '-' + (data[i].startdate.getMonth()+1).toString().padStart(2, '0') + '-' + data[i].startdate.getDate().toString().padStart(2, '0');
          reservedDates.push(temp);

          temp = data[i].enddate.getFullYear() + '-' + (data[i].enddate.getMonth()+1).toString().padStart(2, '0') + '-' + data[i].enddate.getDate().toString().padStart(2, '0');
          reservedDates.push(temp);
        }

        res.json({id, hostUser, address, bedroom, bed, baths, maxGuests, minDaysStay, checkInHour, checkOutHour, amenities, houseRules, cancelationPolicy, reviewCount, ratingScore, minCostPerNight, maxCostPerNight, reservedDates});
      }
    });
  } else { // all query parameters are recieved
    psqlQuery.getCost(id, (err, data) => { // send cost information given the query params
      if (err) {
        res.sendStatus(500);
      } else {
        // destruct queried data object
        let avgCostPerNight = (data.mincostpernight + data.maxcostpernight)/2
        let serviceFee = data.servicefee;
        let cleaningFee = data.cleaningfee;
        let occupancyTax = parseFloat(data.occupancytax);

        res.json({avgCostPerNight, serviceFee, cleaningFee, occupancyTax});
      }
    });
  }

});

// Update / PUT (extension)
router.put('/:id/reservation/:id', (req, res) => {
  psqlQuery.putReservation(1, {}, () => {
    res.json('TESTING POST');
  })
});

// Delete / DELETE (extension)
router.delete('/:id/reservation/:starDate', (req, res) => {
  let accomodation_id = parseInt(req.originalUrl.match(/(?<=listings\/)(.*)(?=\/reservation)/));
  let startDate = req.params.starDate;

  psqlQuery.deleteReservation(accomodation_id, startDate, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.send('TESTING DELETE')
    }
  });

});

module.exports = router;
