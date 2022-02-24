const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
var Session = require("../services/session.js");

const app = express();
const port = 5000;

app.use(cors());
app.use("/", router);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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

router.post("/new-session", function (req, res) {
  // process request
  var decks = Number(req.body.decks);
  var players = Number(req.body.players);
  var cardsPerPlayer = Number(req.body.cardsPerPlayer);
  var cardsOnTable = Number(req.body.cardsOnTable);

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

router.post("/draw-cards", async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  let playerId = Number(req.body.playerId);
  let numOfCards = Number(req.body.numOfCards);

  if (isNaN(sessionId) || isNaN(playerId) || isNaN(numOfCards)) {
    res.status(400).send('Invalid call. Needs sessionId, playerId, and numOfCards as numbers in the query.');
  } else {
    let currSession = concSessions.find(s => s.sessionId === sessionId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      res.status(200).send(currSession.drawCards(playerId, numOfCards));
    }
  }
});

app.listen(port, () => {
  console.log("Now listening on port " + port);
});
