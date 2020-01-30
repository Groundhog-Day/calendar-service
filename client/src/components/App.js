import React, { useState } from 'react';
import Checkout from './Checkout';

export default function App() {
  const [accommodation, setAccommodation] = useState(null);
  

  fetch('/api/v1/listings').then((res) => {
    return res.json();
  }).then(accommodations => {
    console.log(accommodations[0])
    setAccommodation(accommodations[0])
  })

  return (
    <div className="App">
      {accommodation && <Checkout accommodation={accommodation} />}
    </div>
  );
}
