const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

app.listen(port, () => console.log('listening on port: ' + port));



