import React from 'react';
import { shallow } from 'enzyme';
import App from '../components/App.js';

describe('App', () => {
  test('App component h1 tag should equal tuna tataki furakake miso karage', () => {
    const wrap = shallow(<App />)

    expect(wrap.find('h1').text()).toEqual('tuna tataki furakake miso karage')
    expect(wrap.containsMatchingElement(<h1>tuna tataki furakake miso karage</h1>)).toBeTruthy()
  })
});