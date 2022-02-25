const express = require("express");
const cors = require("cors");
var Session = require("../services/session.js");

const app = express();
const port = 5000;

app.use(cors());

var concSessions = [];

/**
 * Creates a session with given pramas.
 *
 * Example
 * POST req: localhost:5000/new-session?decks=1&players=1&cardsPerPlayer=5&cardsOnTable=1
 * response: {
 *       "numDecks":1,
 *       "numPlayers":2,
 *       "sessionId":1,
 *       "players":[
 *           {"cards":[52,51,50,49,48],"playerId":0},
 *           {"cards":[47,46,45,44,43],"playerId":1}
 *       ],
 *       "table":{"cards":[42]},
 *       "deck":[
 *           1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41
 *       ]
 *   }
 */

app.post("/new-session", function (req, res) {
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
      "Invalid call, needs decks, players, cardsPerPlayer and cardsOnTable as numbers in the query."
    );
  }

  currSession = new Session(decks, players, cardsPerPlayer, cardsOnTable);
  concSessions.push(currSession);
  res.send(currSession);
});

app.listen(port, () => {
  console.log("Now listening on port " + port);
});
