const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const http = require("http");
const { Server } = require('socket.io');
const sessionRoute = require('./routes/session');
const playerRoute = require('./routes/player');

var client_url = "http://localhost:3000";

if (process.env.NODE_ENV == 'production') {
  client_url = "http://35.192.81.46:3000";
  console.log(client_url);
}

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: client_url
  }
});
const port = 5000;

io.on("hello-world", (socket) => {
  socket.emit("hello-world");
});

app.use(cors());
app.use(bodyParser.json());

app.use('/session', sessionRoute);
app.use('/player', playerRoute);

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(port);
}
console.log("Now listening on port " + port);

module.exports = { app };