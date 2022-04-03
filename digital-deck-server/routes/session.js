const router = require('express').Router();
const Session = require('../models/session');
const {getConcSessions , addSession, getSession} = require('../services/utilities');
const cardShuffleService = require('../services/cardShuffleService');
var Player = require("../models/player.js");
const cardDistService = require('../services/cardDistService');


// /newsession
router.post('/new', async function (req, res) { 
    // process request make a new session involving only 1 player and dont distribute.
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
      //just make a session of only 1 player right now 
        currSession = new Session(decks, players, cardsPerPlayer, cardsOnTable);
        currSession.players[0].setName(name); 
        addSession(currSession);
        res.status(200).send(currSession);
      
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

//distribute cards during a session
router.post('/distributecards', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call. Needs sessionId as number in the query.');
  } else {
    let currSession = getSession(sessionId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        let distributed = cardDistService.distCards(
          currSession.numDecks,
          currSession.numPlayers,
          currSession.cardsPerPlayer,
          currSession.cardsOnTable,
          currSession.players
        ); 
        currSession.table= distributed.table;
        currSession.deck= distributed.deck;
        res.status(200).send(currSession);
      }
      catch (err){
        res.status(400).send("Invalid Request...");
         console.log(err);
      }
    }
  }
});

//add new player
router.post('/join', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  var name = req.body.name;
  //name and session ID retrieved of a new player now add that player to the lobby
  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call. Needs sessionId as number in the query.');
  } else {
    let currSession = getSession(sessionId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        if (!currSession.gameStarted) {
          let newPlayer = new Player([],name ); //new player made
          currSession.players.push(newPlayer);
          currSession.numPlayers++;
          //playerid is updated with zero cards..
          res.status(200).send(currSession);
        }
        
      }
      catch (err){
        console.log(err);
      }
    }
  }
});

module.exports = router;
