import React from 'react';
import { mount } from 'enzyme';
import Checkout from '../components/Checkout';
import 'isomorphic-fetch';

describe('Checkout', () => {
  const a = {
      reservedDates: (29) ['501', '502', '503', '307', '308', '309', '315', '316', '317', '614', '615', '616', '630', '631', '325', '326', '327', '327', '328', '329', '401', '402', '403', '222', '223', '224', '229', '230', '231'],
      accommodationId: 0,
      costPerNight: 79,
      reviewsCount: 22,
      ratingScore: 4.7,
      cleaningFee: 59,
      serviceFee: 29,
      occupancyFee: 29
    };
  const wrap = mount(<Checkout accommodation={a}/>);

  test('works', () => {
    expect(wrap).toMatchSnapshot()
  })

  test('component have accomodation props', () => {
    expect('accommodation' in wrap.props()).toEqual(true)
  });

  test('component should have class checkout-container', () => {
    wrap.hasClass('checkout-container')
  })

  test('component should have class daily-cost', () => {
    wrap.hasClass('daily-cost')
  })

  test('component should have class date-picker', () => {
    wrap.hasClass('date-picker')
  })

  test('component should have class checkout-component', () => {
    wrap.hasClass('checkout-container')
  })


});
