const router = require('express').Router();
const Session = require('../models/session');
const {getConcSessions , addSession, getSession} = require('../services/utilities');
const cardShuffleService = require('../services/cardShuffleService');

// /newsession
router.post('/new', async function (req, res) {
    // process request
    var decks = Number(req.body.decks);
    var players = Number(req.body.players);
    var name = req.body.name;
    var cardsPerPlayer = Number(req.body.cardsPerPlayer);
    var cardsOnTable = Number(req.body.cardsOnTable);
  
    if (
      isNaN(decks) ||
      isNaN(players) ||
      isNaN(cardsPerPlayer) ||
      isNaN(cardsOnTable) ||
      decks <= 0 ||
      players <= 0 ||
      cardsPerPlayer < 0 ||
      cardsOnTable < 0
    ) {
        res.status(400).send('Invalid request. Needs decks, players, cardsPerPlayer, and cardsOnTable as positive numbers.');
    } else {
      if (cardsPerPlayer * players + cardsOnTable > 52 * decks) {
        res.status(400).send('Invalid request. Cannot distribute more than number of available cards');
      } else {
        currSession = new Session(decks, players, cardsPerPlayer, cardsOnTable);
        currSession.players[0].setName(name);
        currSession.players[0].joined=true; //Indicates the player is joined in the game..
        addSession(currSession);
        res.status(200).send(currSession);
      }
    }
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
    res.status(400).send('Invalid call, needs a valid session id.');
  } else {
    let session = getSession(sessionId);
    if (!session) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      res.status(200).json(session);
    }
  }
});

//shuffle cards during a session
router.post('/shufflecards', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call. Needs sessionId as number in the query.');
  } else {
    let currSession = getSession(sessionId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        let deck = currSession.deck;
        const updated =  cardShuffleService.shuffleCards(deck);
        currSession.deck = updated;
        res.status(200).send(updated);
      }
      catch (err){
        console.log(err);
      }
    }
  }
});

router.post('/joinlobby', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  let playerName = req.body.name;
  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call. Needs sessionId as number in the query.');
  } else {
    let currSession = getSession(sessionId); // got the session
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        let playerID = -1;
        let players = currSession.players;
        let playerIndex = 0;
        for (var i=0 ; i<players.length; i++) {
          if (players[i].joined==false){
            players[i].joined = true;
            players[i].name= playerName;
            playerIndex=i;
            playerID = players[i].playerId;
            break;
          }
        }
          if (playerID!=-1){
            var obj = { session : currSession, id : playerID, index : i  }
            res.status(200).send(obj);
          }
          else {
            res.status(400).send(`Invalid request. Already filled with all players. Session with id ${sessionId}`);

          }
        
      }
      catch (err){
        console.log(err);
      }
    }
  }
});

module.exports = router;