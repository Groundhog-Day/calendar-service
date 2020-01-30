import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Checkout = (props) => {
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);
  const [guestTabActive, setGuestTabActive] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [guests, setGuests] = useState(adults + children + infants);
  const [totalDays, setTotalDays] = useState(3);
  const {
    reservedDates,
    costPerNight,
    reviewsCount,
    ratingScore,
    cleaningFee,
    serviceFee,
    occupancyFee
  } = props.accommodation;


  const handleSelect = (e) => {
    e.preventDefault();
    const { name } = e.target;

    if (name === 'start') {
      setStartDateActive(!startDateActive);
      setGuestTabActive(false);
    }
    if (name === 'end') {
      setEndDateActive(!endDateActive);
      setGuestTabActive(false);
    }
    if (name === 'guest') {
      setGuestTabActive(!guestTabActive);
    }
    if (name === 'close-guest') {
      setGuestTabActive(false);
    }
    if (name === 'addAdult') {
      if (guests < 5) {
        setAdults(adults => adults + 1);
        setGuests(guests => guests + 1);
      }
    }
    if (name === 'removeAdult') {
      if (guests >= 2 && adults >= 2) {
        setAdults(adults => adults - 1);
        setGuests(guests => guests - 1);
      }
    }
    if (name === 'addChild') {
      if (guests < 5) {
        setChildren(children => children + 1);
        setGuests(guests => guests + 1);
      }
    }
    if (name === 'removeChild') {
      if (guests >= 2 && children > 0) {
        setChildren(children => children - 1);
        setGuests(guests => guests - 1);
      }
    }
    if (name === 'addInfant') {
        setInfants(infants => infants + 1);
    }
    if (name === 'removeInfant') {
      if (infants > 0) {
        setInfants(infants => infants - 1);
      }
    }
  };

  return (
    <div className="checkout-container">
      <div className="daily-cost">
        <h4>${costPerNight}<span> per night</span></h4>
        <div className="reviews-container">
          <p className="rating"><i className="fas fa-star" />{ratingScore}</p>
          <p className="reviews">({reviewsCount} reviews)</p>
        </div>
      </div>
      <div className="col dates">
        <p>Dates</p>
        <div className="date-picker">
          {
            !startDateActive
              ? <a name="start" onClick={e => handleSelect(e)}>{moment().format('L')}</a>
              : <a name="start" onClick={e => handleSelect(e)} className="start-date-active">{moment().format('L')}</a>
          }
          {
            !endDateActive
              ? <a name="end" onClick={e => handleSelect(e)}>1/30/2020</a>
              : <a name="end" onClick={e => handleSelect(e)} className="end-date-active">01/23/2020</a>
          }
        </div>
      </div>
      <div className="col guests">
        <p>Guests</p>
        <button name="guest" className="guest-btn" onClick={e => handleSelect(e)}>
          <div className="guest-info">
          {
            (guests > 1)
              ? <p>{guests} guests</p>
              : <p>{guests} guest</p>
          }
          {
            (infants > 0) && <p className="infant-info">, {infants} infants</p>
          }
          </div>
          {
            guestTabActive
              ? <i className="fas fa-chevron-up"></i>
              : <i className="fas fa-chevron-down"></i>
          }
        </button>
        {
          guestTabActive &&
          <div className="guest-selection-card">
            <div className="guest-row">
              <div className="guest-description">
                <h5>Adults</h5>
              </div>
              <div className="guest-selection">
                {
                  (adults === 1)
                    ? <button className="non-targetable-btn">-</button>
                    : <button name="removeAdult" onClick={e => handleSelect(e)}>-</button>
                }
                <h5>{adults}</h5>
                {
                  (guests >= 5)
                    ? <button className="non-targetable-btn">-</button>
                    : <button name="addAdult" onClick={e => handleSelect(e)}>+</button>
                }
              </div>
            </div>
            <div className="guest-row">
              <div className="guest-description bad-practice">
                <h5>Children</h5>
                <p>Ages 2-12</p>
              </div>
              <div className="guest-selection">
                {
                  (children === 0)
                    ? <button className="non-targetable-btn">-</button>
                    : <button name="removeChild" onClick={e => handleSelect(e)}>-</button>
                }
                <h5>{children}</h5>
                {
                  (guests >= 5)
                    ? <button className="non-targetable-btn">-</button>
                    : <button name="addChild" onClick={e => handleSelect(e)}>+</button>
                }
              </div>
            </div>
            <div className="guest-row">
              <div className="guest-description bad-practice">
                <h5>Infants</h5>
                <p>Under 2</p>
              </div>
              <div className="guest-selection">
                {
                  (infants === 0)
                    ? <button className="non-targetable-btn">-</button>
                    : <button name="removeInfant" onClick={e => handleSelect(e)}>-</button>
                }
                <h5>{infants}</h5>
                <button name="addInfant" onClick={e => handleSelect(e)}>+</button>
              </div>
            </div>
            <div className="guest-row guest-prompt">
            <h6>
              5 guests maximum. Infants don't count toward the number of guests.
            </h6>
            </div>
            <div className="guest-row close-section">
              <button name="close-guest" onClick={e => handleSelect(e)}className="guest-card-close-btn">
                Close
              </button>
            </div>
          </div>
        }
      </div>
      <div className="prices-container">
        <div className="row">
          <p>${costPerNight} x {totalDays} nights</p>
          <p>${costPerNight * totalDays}</p>
        </div>
        <div className="row">
          <p>Cleaning fee <i className="far fa-question-circle" />
          </p>
          <p>${cleaningFee}</p>
        </div>
        <div className="row">
          <p>Service fee <i className="far fa-question-circle" /></p>
          <p>${serviceFee}</p>
        </div>
        <div className="row">
          <p>Occupancy taxes and fees <i className="far fa-question-circle"></i></p>
          <p>${occupancyFee}</p>
        </div>
        <div className="row total">
          <p>Total</p>
          <p>${(costPerNight * totalDays) + cleaningFee + serviceFee + occupancyFee}</p>
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

Checkout.propTypes = {
  reservedDates: PropTypes.array,
  costPerNight: PropTypes.number,
  reviewsCount: PropTypes.number,
  ratingScore: PropTypes.number,
  cleaningFee: PropTypes.number,
  serviceFee: PropTypes.number,
  occupancyFee: PropTypes.number
};

export default Checkout;