// function component() {
//   const element = document.createElement('div');

//   // Lodash, currently included via a script, is required for this line to work
//   element.innerHTML = 'tuna tataki furakake miso karage';

//   return element;
// }

// document.body.appendChild(component());

const React = require('react');
const ReactDOM = require('react-dom');

ReactDOM.render(<h1>tuna tataki furakake miso karage</h1>, document.getElementById('app'));
