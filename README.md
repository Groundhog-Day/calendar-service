# calendar-service

## CRUD Opersations
The server provide RESTful services with CRUD operations:

#### Create / POST
**Endpoint**: `/api/v1/listings/:id/reservation`  
This route allows to store new reservation into database and returns JSON object about reservation id.

Request Option Example  
```javascript
{  
  method: 'POST',  
  username: 'hackreactor',  
  startDate: '021520',  
  endDate: '021720',  
  adults: 2,  
  children: 0,  
  infants: 1,  
  paid: false,  
}
```

Response Data Example
```javascript
{  
  reservationID: 1  
}
```


#### Read / GET
**Endpoint**: `/api/v1/listings/:id`  
This route returns JSON object that holds information about accomodation, such as the accomodation host and the number of review.

Request Option Example  
```javascript
{  
  method: 'GET'  
}
```

Response Data Example
```javascript
{  
  host: 'Jordan Spears',  
  joinDate: '120209',  
  address: '44 Tehama St, San Francisco, CA 94105',  
  bedroom: 2,  
  bed: 2,  
  baths: 1,  
  maxGuests: 3,
  minDayStay: 1,  
  checkInHour: 14:30,  
  checkOutHour: 10:30,  
  amenities: '11101111',  
  houseRules: '001110',  
  cancelationPolicy: 'Cancel up to 30 days before check-in and get a full refund.',  
  reviewsCount: 412,  
  ratingScore: 4.86,  
  avgCostPerNight: 65,  
  reservedDates: [ '022320', '022520', '030320', '030420' ]  
}
```

Each digit of `amenities` and `houseRules` describes each category of amenities and general house rules. For instance, the first digit implies `true` for 'Wi-fi', but 4th digit implies `false` for private entrance. Elements with even indices in reservedDates array describe start date of reservation and elements with odd indices describe end date.

With optional query strings `startDate`, `endDate`, `adults`, and `children`, the route returns JSON object of price information about stay over from `startDate` to `endDate` for `adults` and `children` when all parameter hold valid values. Both `startDate` and `endDate` value should be in the form of 'DDMMYY' like elements in `reservedDates` from above, and the sum of `adults` and `children` should be less than or `maxGuests`.

Response Data for Query Example
```javascript
{  
 avgCostPerNight: 110,  
 cleaningFee: 30,
 serviceFee: 20,
 occupancyFee: 20
}
```

#### Update / PUT
**Endpoint**: `/api/v1/listings/:id/reservation/:id`  
This route updates reservation information associated with particular accomodation.

Request Option Example  
```javascript
{  
  method: 'PUT'  
  username: 'hackreactor',  
  startDate: '030220',  
  endDate: '030420',  
  paid: false,  
  adults: 2,  
  children: 1,  
  infants: 0,  
}
```
Response Data Example
```javascript
{ }
```

#### Delete / DELETE
**Endpoint**: `/api/v1/listings/:id/reservation/:id`  
This route deletes the reservation with id value `:id` from the database.

Request Option Example  
```javascript
{  
 method: 'DELETE'  
 username: hackreactor,  
}
```

Expected Response Data Format
```javascript
{ }
```
