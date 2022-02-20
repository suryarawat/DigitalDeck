const express = require("express");
const cors = require("cors");
var Session = require("../services/session.js");

const app = express();
const port = 5000;

app.use(cors());

var concSessions = [];

app.get("/new-session", function (req, res) {
  // process request
  var decks = Number(req.query.decks);
  var players = Number(req.query.players);
  var cardsPerPlayer = Number(req.query.cardsPerPlayer);
  var cardsOnTable = Number(req.query.cardsOnTable);
  if (
    isNaN(decks) ||
    isNaN(players) ||
    isNaN(cardsPerPlayer) ||
    isNaN(cardsOnTable)
  ) {
    throw new Error(
      "Invalid call, needs decks, player, cardsPerPlayer and cardsOnTable as numbers in the query."
    );
  }
  currSession = new Session(decks, players, cardsPerPlayer, cardsOnTable);
  concSessions.push(currSession);
  res.send(currSession);
});

app.listen(port, () => {
  console.log("Now listening on port " + port);
});
