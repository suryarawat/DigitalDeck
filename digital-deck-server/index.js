const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const http = require("http");
const { Server } = require('socket.io');
const sessionRoute = require('./routes/session');
const playerRoute = require('./routes/player');
const blackjackRoute = require('./routes/blackjack');
const {handleSocket} = require('./socket');

var client_url = "http://localhost:3000";

if (process.env.NODE_ENV == 'production') {
  client_url = "http://35.192.81.46:3000";
  console.log(client_url);
}

const app = express();

app.use(express.static('../digital-deck-ui')); 

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: client_url
  }
});
const port = 5000;

handleSocket(io);

app.use(cors());
app.use(bodyParser.json());

app.use('/session', sessionRoute);
app.use('/player', playerRoute);
app.use('/blackjack', blackjackRoute);

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(port);
}
console.log("Now listening on port " + port);

module.exports = { app };