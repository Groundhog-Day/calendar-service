import React, { useState } from 'react';
import Checkout from './Checkout';

export default function App() {
  const [accommodation, setAccommodation] = useState(null);

  fetch('/api/v1/listings').then((res) => {
    return res.json();
  }).then((accommodations) => {
    setAccommodation(accommodations[12]);
  });

  return (
    <div className="App">
      { accommodation && <Checkout accommodation={accommodation} /> }
    </div>
  );
}
