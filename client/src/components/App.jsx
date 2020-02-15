import React, { useState, useEffect } from 'react';
import Checkout from './Checkout.jsx';

export default function App() {
  const [accommodation, setAccommodation] = useState(null);
  const n = Math.floor(Math.random() * Math.floor(99))

  useEffect(() => {
    fetch('/api/v1/listings').then((res) => {
      return res.json();
    }).then(accommodations => {
      setAccommodation(accommodations[n])
    })
  }, [])

  return (
    <div className="App">
      {accommodation && <Checkout accommodation={accommodation} />}
    </div>
  );
}
