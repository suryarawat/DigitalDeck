const router = require('express').Router();
const Session = require('../models/session');
const {getConcSessions , addSession, getSession} = require('../services/utilities');
const cardShuffleService = require('../services/cardShuffleService');

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

// Get session based on id
router.get('/current', async function(req, res) {
  // process request
  var sessionId = Number(req.query.sessionId);
  if (isNaN(sessionId)) {
    throw new Error(
      "Invalid call, needs a valid session id."
    );
  }
  let session = getSession(sessionId);
  if (!session) {
    res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
  }
  else{
  res.status(200).json(session);}
});

//shuffle cards during a session
router.post('/shufflecards', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call. Needs sessionId as number in the query.');
  } else {
    let currSession = getSession(sessionId);
    let deck = currSession.deck;
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        const updated =  cardShuffleService.shuffleCards(deck);
        currSession.updateDeck(updated);
        res.status(200).send(updated);
      }
      catch (err){
        console.log(err);
      }
    }
  }
});


module.exports = router;