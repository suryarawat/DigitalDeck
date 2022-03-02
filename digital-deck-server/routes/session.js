const router = require('express').Router();
const Session = require('../models/session');
const {getConcSessions , addSession} = require('../services/utilities');

// /newsession
router.post('/new', async function (req, res) {
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
    addSession(currSession);
    res.send(currSession);
});

// for test
router.get('/info', async function(req, res) {
    res.status(200).json(getConcSessions());
});


module.exports = router;