import React, { useState } from "react";

export default function Checkout() {
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);
  const [guestTabActive, setGuestTabActive] = useState(false);

  const handleSelect = e => {
    if (e.target.name === 'start') {
      setStartDateActive(!startDateActive);
    }
    if (e.target.name === 'end') {
      setEndDateActive(!endDateActive);
    }
    if (e.target.name === 'guest') {
      setGuestTabActive(!guestTabActive);
    }
  }

  return (
    <div className="checkout-container">
      <div className="daily-cost">
        <h4>$77<span> per night</span></h4>
        <div className="reviews-container">
          <p className="rating"><i class="fas fa-star"></i> 4.2 </p>
          <p className="reviews">(69 reviews)</p>
        </div>
      </div>
      <div className="line"></div>
      <div className="col dates">
        <p>Dates</p>
        <div className="date-picker">
          {
            !startDateActive
              ? <a name="start" onClick={e => handleSelect(e)}>01/23/2020</a>
              : <a name="start" onClick={e => handleSelect(e)} className="start-date-active">01/23/2020</a>
          }
          {
            !endDateActive
              ? <a name="end" onClick={e => handleSelect(e)}>01/23/2020</a>
              : <a name="end" onClick={e => handleSelect(e)} className="end-date-active">01/23/2020</a>
          }
        </div>
      </div>
      <div className="col guests">
        <p>Guests</p>
        <button name="guest" className="guest-btn" onClick={e => handleSelect(e)}>
          <p>1 guest</p>
          <i class="fas fa-chevron-down"></i>
        </button>
        {
          guestTabActive &&
          <div className="guest-selection-card">
            <div className="guest-row">
              <div className="guest-description">
                <h5>Adults</h5>
              </div>
              <div className="guest-selection">
                <button>-</button>
                <p>0</p>
                <button>+</button>
              </div>
            </div>
            <div className="guest-row">
              <div className="guest-description">
                <h5>Children</h5>
                <p>Ages under 12</p>
              </div>
              <div className="guest-selection">
                <button>-</button>
                <p>0</p>
                <button>+</button>
              </div>
            </div>
            <div className="guest-row">
              <div className="guest-description">
                <h5>Infants</h5>
                <p>Under 2</p>
              </div>
              <div className="guest-selection">
                <button>-</button>
                <p>0</p>
                <button>+</button>
              </div>
            </div>
          </div>
        }
      </div>
      <div className="prices-container">
        <div className="row">
          <p>$73 x 7 nights</p>
          <p>$508</p>
        </div>
        <div className="row">
          <p>Cleaning fee <i onClick="" class="far fa-question-circle"></i></p>
          <p>$109</p>
        </div>
        <div className="row">
          <p>Service fee <i class="far fa-question-circle"></i></p>
          <p>$87</p>
        </div>
        <div className="row">
          <p>Occupancy taxes and fees <i class="far fa-question-circle"></i></p>
          <p>$34</p>
        </div>
        <div className="row total">
          <p>Total</p>
          <p>$708</p>
        </div>
      </div>
      <div>
        <button className="reserve-btn">Reserve</button>
      </div>
      <div className="charge-comment">
        <p>You won’t be charged yet</p>
        {/* <p>Certain reservations may also require a security deposit.</p> */}
      </div>
    </div>
  );
}
