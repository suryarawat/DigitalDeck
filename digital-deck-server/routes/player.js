const router = require('express').Router();
const { getPlayer, getSession } = require('../services/utilities');
const cardDrawService = require('../services/cardDrawService');

router.post('/playcard', async function (req, res) {
  var sessionId = req.body.sessionId;
  var playerId = req.body.playerId;
  var cardIndex = req.body.cardIndex;  // there should only be one of this required, either the card or the index
  var card = req.body.card;           // since the card needs to be added to the table, sending the index of the card in player's hand shouldn't be required


  if (isNaN(sessionId) || isNaN(playerId) || isNaN(cardIndex) || isNaN(card)) {
    res.status(400).send("Invalid call. Needs sessionId, playerId, cardIndex and card as numbers in the query.");
    return;
  }

  if (cardIndex < 0 || card < 0 || card > 52) {
    res.status(400).send("Invalid call. Card Index and card should be in bounds.");
    return;
  }

  var session = getSession(sessionId);
  if (!session) {
    res.status(400).send("Invalid request. Could not find session with Id " + sessionId);
    return;
  }

  var table = session.table;
  var player = getPlayer(session, playerId);
  if (!player) {
    res.status(400).send("Invalid request. Could not find player with Id " + playerId + " in session " + sessionId);
    return;
  }

  if(cardIndex > player.cards.length)
  {
    res.status(400).send("Invalid request. Can not play cardIndex " + cardIndex + ". Player " + playerId + " only has " + player.cards.length + " cards.");
    return;
  }


  player.removeCard(cardIndex);
  table.addCardTop(card);
  res.status(200).send(session);

});

router.post('/drawcard', async function (req, res) {
  let sessionId = Number(req.body.sessionId);
  let playerId = Number(req.body.playerId);
  let numOfCards = Number(req.body.numOfCards);

  if (isNaN(sessionId) || isNaN(playerId) || isNaN(numOfCards) || numOfCards <= 0) {
    res.status(400).send('Invalid call. Needs sessionId, playerId, and numOfCards as positive numbers in the query.');
  } else {
    let currSession = getSession(sessionId);

    if (!currSession) {
      res.status(400).send(`Invalid request. Could not find session with Id ${sessionId}.`);
    } else {
      let deck = currSession.deck;
      let player = getPlayer(currSession, playerId);

      if (deck.length === 0) {
          res.status(400).send(`Invalid request. Could not draw from empty deck`);
      } else if (!player) {
          res.status(400).send(`Invalid request. Could not find player with Id ${playerId} in session ${sessionId}.`);
      } else {
          res.status(200).send(cardDrawService.drawCards(deck, numOfCards, player));
      }
    }
  }
});

module.exports = router;