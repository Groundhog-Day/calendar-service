import React, { useState } from 'react';
import moment from 'moment';

export default function Checkout(props) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [month, setMonth] = useState(new Date().getMonth());

  const makeMonth = (month) => {
    const firstDay = new Date(2020, month, 1).toString().substr(0,2).toLowerCase();
    const days = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };
    const lastDayOfFirstWeek = 7 - days[firstDay];
    const lastDayOfMonth = new Date(2020, month + 1, 0).getDate();
    const weeks = [];

    const makeBlankCell = () => {
      return (
        <td className="cell-inactive blank" tabIndex="-1">
          <div className="day blank">
            <div></div>
          </div>
        </td>
      )
    }

    const makeRealCell = (n) => {
      let date = new Date(2020, month, n);
      let currentTime = new Date();
      let formattedDate = moment(date).format('L');

      // if (date.getTime() > currentTime.getTime() && props.reservedDates.indexOf(formattedDate) === -1) {
      if (date.getTime() > currentTime.getTime()) {
        return (
          <td className="cell" tabIndex="-1"onClick={e => props.handleDate(e)}>
            <div className="day">
              <div data-value={new Date(2020, month, n)}>{n}</div>
            </div>
          </td>
        )
      }
      return (
        <td className="cell-inactive" tabIndex="-1">
          <div className="day crossed-out">
            <div className="crossed-out" data-value={new Date(2020, month, n)}>{n}</div>
          </div>
        </td>
      )
    }

    let week = [];

    for (let i = 0; i < days[firstDay]; i++) {
      week.push(makeBlankCell());
    }

    for (let i = 1; i <= lastDayOfFirstWeek; i++) {
      week.push(makeRealCell(i));
    }

    weeks.push(week);
    week = [];

    for (let i = lastDayOfFirstWeek + 1; i <= lastDayOfMonth + 1; i++) {
      if (week.length === 7 || i === lastDayOfMonth + 1) {
        weeks.push(week);
        week = [];
      }
      week.push(makeRealCell(i));
    }
    return weeks;
  }

  const handleMonthSelection = (e, direction) => {
    e.preventDefault();

    if (direction === '+' && months[month + 1]) {
      setMonth(month => month + 1);
    }
    if (direction === '-' && months[month - 1]) {
      setMonth(month => month - 1);
    }
  }

  return (
    <div className="calendar">
      <div className="month-selection">
        <button onClick={e => handleMonthSelection(e, '-')}><i className="fas fa-arrow-left"></i></button>
        <h5>{ months[month] } 2020</h5>
        <button onClick={e => handleMonthSelection(e, '+')}><i className="fas fa-arrow-right"></i></button>
      </div>
      <div className="days-of-week">
        <p>Su</p>
        <p>Mo</p>
        <p>Tu</p>
        <p>We</p>
        <p>Th</p>
        <p>Fr</p>
        <p>Sa</p>
      </div>
      <table>
        {makeMonth(month).map((week, idx) => {
          return <tr key={idx} className="week">{week}</tr>
        })}
      </table>
      <div className="clear-dates">
        <button>Clear dates</button>
      </div>
    </div>
  )
}

