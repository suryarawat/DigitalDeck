const router = require('express').Router();
const { getPlayer, getSession } = require('../services/utilities');
const cardDrawService = require('../services/cardDrawService');
const cardShuffleService = require('../services/cardShuffleService');

router.post('/playcard', async function (req, res) {
  var sessionId = req.body.sessionId;
  var playerId = req.body.playerId;
  var cardIndex = req.body.cardIndex;  // there should only be one of this required, either the card or the index
  var card = req.body.card;           // since the card needs to be added to the table, sending the index of the card in player's hand shouldn't be required

  var session = getSession(sessionId);
  var table = session.table;
  var player = getPlayer(session, playerId);

  try {
    player.removeCard(cardIndex);
    table.addCardTop(card);
    res.status(200).send();
  }
  catch (err) {
    console.log(err);
    res.status(400).send();
  }
});

router.post('/drawcard', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  let playerId = Number(req.body.playerId);
  let numOfCards = Number(req.body.numOfCards);
  if (isNaN(sessionId) || isNaN(playerId) || isNaN(numOfCards)) {
    res.status(400).send('Invalid call. Needs sessionId, playerId, and numOfCards as numbers in the query.');
  } else {
    let currSession = getSession(sessionId);
    let deck = currSession.deck;
    let player = getPlayer(currSession, playerId);
    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}`);
    } else {
      res.status(200).send(cardDrawService.drawCards(deck, numOfCards, player));
    }
  }
});

router.post('/shufflecards', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  if (isNaN(sessionId)) {
    res.status(400).send('Invalid call. Needs sessionId, playerId, and numOfCards as numbers in the query.');
  } else {
    let currSession = getSession(sessionId);
    let deck = currSession.deck;
    console.log(deck);
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