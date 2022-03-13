const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const http = require("http");
const { Server } = require('socket.io');
const sessionRoute = require('./routes/session');
const playerRoute = require('./routes/player');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});
const port = 5000;

io.on("connection", (socket) => {
  console.log("Connected");
  socket.emit("hello-world");
})

app.use(cors());
app.use(bodyParser.json());

app.use('/session', sessionRoute);
app.use('/player', playerRoute);

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(port);
}
console.log("Now listening on port " + port);

module.exports = { app };