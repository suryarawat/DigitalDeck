const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const sessionRoute = require('./routes/session') 
const playerRoute = require('./routes/player') 

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/session', sessionRoute);
app.use('/player', playerRoute);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port);
}
console.log("Now listening on port " + port);

module.exports = { app };