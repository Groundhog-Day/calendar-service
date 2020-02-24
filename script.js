import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1,
  duration: '300s'
};

export default function() {
  let id = Math.ceil(Math.random() * (10 ** 7));
  let url = `http://localhost:3000/api/v1/listings/${id}`;

  let res = http.get(url);
  sleep(1);
}