import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1000,
  duration: '300s'
};

export default function() {
  let accomodation_id = Math.ceil(Math.random() * (10 ** 7));
  let user_id = Math.ceil(Math.random() * 24 * (10 * 6));

  let dateTracker = new Date();
  dateTracker.setDate(dateTracker.getDate() + Math.floor(Math.random() * 8));
  
  let startDate = `${dateTracker.getFullYear()}-${(dateTracker.getMonth()+1).toString().padStart(2, '0')}-${dateTracker.getDate()}`;

  dateTracker.setDate(dateTracker.getDate() + 1 + Math.floor(Math.random() * 3));
  
  let endDate = `${dateTracker.getFullYear()}-${(dateTracker.getMonth()+1).toString().padStart(2, '0')}-${dateTracker.getDate()}`;

  let adults = 1 + Math.floor(Math.random() * 3);
  let children = Math.floor(Math.random() * 4);
  let infants = Math.floor(Math.random() * 3);

  let paid = (Math.random() < 0.8);

  
  let url = `http://localhost:3000/api/v1/listings/${accomodation_id}/reservation`;
  let payload = {user_id, startDate, endDate, adults, children, infants};

  let res = http.post(url, payload);
  sleep(1);
}