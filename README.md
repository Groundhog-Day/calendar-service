# calendar-service

## CRUD Opersations
The server provide RESTful services with CRUD operations:

#### Create / POST
**Endpoint**: `/api/v1/listings/:id/reservation/:startDate-:endDate`  
This route allows to store new reservation into database.

Expected Request Object Format
>{  
> method: 'POST',  
> username: String,  
> paid: Boolean,  
> numAdults: Number,  
> numChildren: Number,  
> numInfants: Number,  
>}

Expected Response Data Format
>{  
> reservationID: Number,
>}


#### Read / GET
**Endpoint**: `/api/v1/listings/:id/`  
This route returns data about accomodation, such as price per night and the number of review.

Expected Request Object Format  
>{  
> method: 'GET'  
>}

Expected Response Data Format  
>{  
> reviewsCount: Number,  
> ratingScore: Number,  
> maxGuests: Number,  
> minDaysStay: Number,  
> reservedDates: [ String, String, ... ]
>}  
Even index elements are string about startDate and odd index elements are string about endDate of reservation. Both string are in the form of 'DDMMYY'

**Endpoint**: `/api/v1/listings/:id/reservation/:startDate-:endDate`  
This route returns price information about stay over from `:startDate` to `:endDate`. Both `:startDate` and `:endDate` should be in the form of 'DDMMYY'.

Expected Request Object Format  
>{  
> method: 'GET',  
> numAdults: Number,  
> numChildren: Number,  
> numInfants: Number,  
>}

Expected Response Data Format
>{  
> costPerNight: Number,  
> cleaningFee: Number,
> serviceFee: Number,
> occupancyFee: Number
>}

#### Update / PUT
**Endpoint**: `/api/v1/listings/:id/reservation/:id`  
This route updates reservation information associated with particular acoomodation.

Expected Request Object Format  
>{  
> method: 'PUT'  
> username: String,  
> startDate: String,  
> endDate: String,  
> paid: Boolean,  
> numAdults: Number,  
> numChildren: Number,  
> numInfants: Number,  
>}

Expected Response Data Format
>{ }

#### Delete / DELETE
**Endpoint**: `/api/v1/listings/:id/reservation/:id`  
This route deletes the reservation with id value `:id` from the database.

Expected Request Object Format
>{  
> method: 'DELETE'  
> username: String,  
>}

Expected Response Data Format
>{ }



<!--   >
  >provides general information about accomodation, such as price per night and the number of reviews, on page load
  >
  >Endpoint: 
 -->