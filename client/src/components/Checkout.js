import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function Checkout(props) {
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);
  const [activeDate, setActiveDate] = useState(null);
  const [activeStartDatePicker, setActiveStartDatePicker] = useState(false);
  const [activeEndDatePicker, setActiveEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(moment().format('L'));
  const [endDate, setEndDate] = useState(moment().add(1, 'days').format('L'));
  const [guestTabActive, setGuestTabActive] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [guests, setGuests] = useState(adults + children + infants);
  const totalDays = Math.ceil(Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const {
    reservedDates,
    costPerNight,
    reviewsCount,
    ratingScore,
    maxGuests,
    cleaningFee,
    serviceFee,
    occupancyFee
  } = props.accommodation;


  const handleSelect = (e) => {
    e.preventDefault();
    const { name } = e.target;

    if (name === 'start') {
      setStartDateActive(!startDateActive);
      setActiveStartDatePicker(!activeStartDatePicker)
      setActiveEndDatePicker(false);
      setGuestTabActive(false);
    }
    if (name === 'end') {
      setEndDateActive(!endDateActive);
      setActiveStartDatePicker(false);
      setActiveEndDatePicker(!activeEndDatePicker)
      setGuestTabActive(false);
    }
    if (name === 'guest') {
      setGuestTabActive(!guestTabActive);
    }
    if (name === 'close-guest') {
      setGuestTabActive(false);
    }
    if (name === 'addAdult') {
      if (guests < maxGuests) {
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
      if (guests < maxGuests) {
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

  const handleDaySelection = (e) => {
    let date = moment(e.target.dataset.value).format('L');

    setActiveDate('active-date-cell');

    if (startDateActive) {
      setStartDate(date);
      setStartDateActive(false);
      setEndDateActive(true);
      setActiveStartDatePicker(false);
      setActiveEndDatePicker(true);
    }

    if (endDateActive) {
      if (moment(startDate).format() < moment(e.target.dataset.value).format()) {
        setEndDate(date);
        setEndDateActive(false);
        setActiveEndDatePicker(false);
      } else {
        setStartDate(date);
        setEndDateActive(true);
        setActiveEndDatePicker(true);
        setActiveStartDatePicker(false);
      }
    }
  }

  useEffect(() => {
    handleDaySelection
  }, [startDate, endDate])

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
        <p className="bold">Dates</p>
        <div className="date-picker">
          <a name="start" className={activeStartDatePicker && 'activate-start-date-picker'} onClick={e => handleSelect(e)}>{startDate}</a>
          {
            startDateActive &&
            (<div className="calendar-date-selection-card">
              <Calendar handleDate={handleDaySelection} activated={activeDate} reservedDates={reservedDates}/>
            </div>)
          }
          <img className="arrow" height="15" width="30" src="https://www.pngkit.com/png/full/448-4484049_png-file-svg-arrow-right-icon-png.png" />
          <a name="end" className={activeEndDatePicker && 'activate-end-date-picker'} onClick={e => handleSelect(e)}>{endDate}</a>
          {
            endDateActive &&
            (<div className="calendar-date-selection-card">
              <Calendar handleDate={handleDaySelection} activated={activeDate} />
            </div>)
          }
        </div>
      </div>
      <div className="col guests">
        <p className="bold">Guests</p>
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
                  (guests >= maxGuests)
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
                  (guests >= maxGuests)
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
                {
                  (infants < 5)
                  ? <button name="addInfant" onClick={e => handleSelect(e)}>+</button>
                  : <button className="non-targetable-btn">-</button>
                }
              </div>
            </div>
            <div className="guest-row guest-prompt">
            <h6>
              {maxGuests} guests maximum. Infants don't count toward the number of guests.
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
          <p>${costPerNight} x {totalDays} {totalDays < 2 ? 'night' : 'nights'}</p>
          <p>${costPerNight * totalDays}</p>
        </div>
        <div className="row">
          <p>Cleaning fee
            <i className="far fa-question-circle question-prompt" name="cleaningFee" onClick={e => handleQuestion(e)} />
          </p>
          <p>${cleaningFee}</p>
        </div>
        <div className="row">
          <p>Service fee
            <i className="far fa-question-circle question-prompt" name="serviceFee" onClick={e => handleQuestion(e)} />
          </p>
          <p>${serviceFee}</p>
        </div>
        <div className="row">
          <p>Occupancy taxes and fees
            <i className="far fa-question-circle question-prompt" name="occupancyFee" onClick={e => handleQuestion(e)} />
          </p>
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
