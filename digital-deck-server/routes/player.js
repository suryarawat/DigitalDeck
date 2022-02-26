const router = require('express').Router();
const {getPlayer, getSession} = require('../services/utilities');
const cardDrawService = require('../services/cardDrawService');

router.post('/playcard', async function(req, res) {
    var sessionId = req.body.sessionId; 
    var playerId = req.body.playerId; 
    var cardIndex = req.body.cardIndex;  
    var card = req.body.card; 

    var session = getSession(sessionId);
    var table = session.table;
    var player = getPlayer(session, playerId);
    
    try{
        player.removeCard(cardIndex);
        table.addCardTop(card);
        res.status(200).send();
    }
    catch(err){
        console.log(err);
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


module.exports = router;