EXPLAIN ANALYZE SELECT * FROM accomodations, reservations WHERE accomodations.id = 82739607 AND accomodations.id = reservations.accomodation_id;

EXPLAIN ANALYZE INSERT INTO reservations (accomodation_id,user_id,startDate,endDate,adults,children,infants,paid) VALUES (1098376,35097,'2019-03-05','2019-03-08',2,1,0,true);

EXPLAIN ANALYZE UPDATE reservations SET startDate='2019-02-27', endDate='2019-03-02', adults=2, children=2, infants=0, paid=true WHERE accomodation_id=1098376 AND user_id=35097;

EXPLAIN ANALYZE DELETE FROM reservations WHERE accomodation_id=1098376 AND user_id=35097;