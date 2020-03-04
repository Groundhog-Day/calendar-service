require('newrelic');

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const router = require('./router.js');

const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);

// logging and parsing
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// serve static file
app.use(express.static(path.join(__dirname, '../client', 'dist')));

// use router to respond to http request
app.use('/api/v1/listings', router);

app.listen(port, () => {
  console.log('listening on port: ' + port)}
);

