const router = require('express').Router();
const Session = require('../models/session');
const {getConcSessions, addSession, getSession, cleanSession, updateSession} = require('../services/utilities');
const cardShuffleService = require('../services/cardShuffleService');
var Player = require("../models/player.js");
var Table = require("../models/table.js");
const cardDistService = require('../services/cardDistService');


// /newsession
router.post('/new', async function (req, res) { 
    // process request make a new session involving only 1 player and dont distribute.
    var decks = Number(req.body.decks);
    var players = Number(req.body.players);
    var name = req.body.name;
    var cardsPerPlayer = Number(req.body.cardsPerPlayer);
    var cardsOnTable = Number(req.body.cardsOnTable);
    var gamemode = Number(req.body.gamemode);
  
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
        var currSession = await Session.build(decks, players, cardsPerPlayer, cardsOnTable, gamemode);
        currSession.players[0].setName(name); 
        await addSession(currSession);
        cleanSession(currSession);
        res.status(200).send(currSession);
      
    }
});

// for test
router.get('/info', async function(req, res) {
    res.status(200).json( await getConcSessions());
});

// Get session based on id
router.get('/current', async function(req, res) {
  // process request
  var sessionId = Number(req.query.sessionId);
  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call, needs a valid session id.');
  } else {
    let session = await getSession(sessionId);
    if (!session || session == {}) {
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
    let currSession = await getSession(sessionId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        let deck = currSession.deck;
        const updated =  cardShuffleService.shuffleCards(deck);
        currSession.deck = updated;
        await updateSession(currSession);
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
  let doClear = req.body.doClear;

  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call. Needs sessionId as number in the query.');
  } else {
    let currSession = await getSession(sessionId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        let distributed = cardDistService.distCards(
          currSession.numDecks,
          currSession.numPlayers,
          currSession.cardsPerPlayer,
          currSession.cardsOnTable,
          currSession.players,
          doClear ?? false
        ); 
        currSession.table= new Table(distributed.table.cards);
        currSession.deck= distributed.deck;
        currSession.gameStarted = true;
        await updateSession(currSession);
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
    let currSession = await getSession(sessionId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      try {
        if (!currSession.gameStarted) {
          if (currSession.players.filter((p) => p.name === name).length === 0) {
            let newPlayer = Player.build([],name, currSession.players.length); //new player made
            currSession.players.push(newPlayer);
            currSession.numPlayers++;
            await updateSession(currSession);
            //playerid is updated with zero cards..
            res.status(200).send(currSession);
          } else {
            res.status(200).send({ isNameDuplicate: true });
          }
        }
        else {
          res.status(200).send({ gameStarted: true });
        }
      }
      catch (err){
        console.log(err);
      }
    }
  }
});

module.exports = router;
