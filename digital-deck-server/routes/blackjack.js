const router = require('express').Router();
const { getSession, getPlayer, updateSession } = require('../services/utilities');
const cardShuffleService = require('../services/cardShuffleService');

const CardValue = [
  1,2,3,4,5,6,7,8,9,10,10,10,10,
  1,2,3,4,5,6,7,8,9,10,10,10,10,
  1,2,3,4,5,6,7,8,9,10,10,10,10,
  1,2,3,4,5,6,7,8,9,10,10,10,10
];

function sumOfCards(cards)
{
    const aces = cards.filter((card) => {
      const cardId = (card - 1) % 52;
      return cardId === 0 || cardId === 13 || cardId === 26 || cardId === 39;
    });
    const noAces = cards.filter((card) => !aces.includes(card));

    let total = 0;

    noAces.forEach((card) => {
      total += CardValue[(card - 1) % 52];
    });

    aces.forEach(() => {
      total += total <= 10 ? 11 : 1;
    });

    return total;
}

router.post('/init', async function (req, res) {
    var sessionId = req.body.sessionId;

    if (isNaN(sessionId)) {
        res.status(400).send("Invalid call. Needs sessionId as a number in the query.");
        return;
    }

    var session = await getSession(sessionId);
    if (!session) {
      res.status(400).send("Invalid request. Could not find session with Id " + sessionId);
      return;
    }

    var table = session.table;
    table.cards[0] = -1 * table.cards[0] // flip one card

    await updateSession(session);
    res.status(200).send(session);
})

router.post('/surrender', async function (req, res) {
    var sessionId = Number(req.body.sessionId);
    var playerId = Number(req.body.playerId);

    if (isNaN(sessionId) || isNaN(playerId)) {
        res.status(400).send("Invalid call. Needs sessionId as a number in the query.");
        return;
    }

    var session = await getSession(sessionId);
    if (!session) {
      res.status(400).send("Invalid request. Could not find session with Id " + sessionId);
      return;
    }

    var player = getPlayer(session, playerId);
    if (!player) {
        res.status(400).send("Invalid request. Could not find player with Id " + playerId + " in session " + sessionId);
        return;
    }

    for (var i = 0; i < player.cards.length; i++)
        player.cards[i] = 0;

    session.players[playerId] = player;
    await updateSession(session);
    res.status(200).send();
})

router.post('/dealer', async function (req, res) {
    var sessionId = Number(req.body.sessionId);

    if (isNaN(sessionId)) {
        res.status(400).send("Invalid call. Needs sessionId as a number in the query.");
        return;
    }

    var session = await getSession(sessionId);
    if (!session) {
      res.status(400).send("Invalid request. Could not find session with Id " + sessionId);
      return;
    }

    var table = session.table;
    var deck = session.deck;
    table.cards[0] = Math.abs(table.cards[0]);

    var dealersum = sumOfCards(table.cards);
    while(dealersum <= 16)
    {
        table.addCardTop(deck.pop());
        dealersum = sumOfCards(table.cards);
    }

    var players = session.players
    var winners = []
    for (var player of players)
    {
        var playerSum = sumOfCards(player.cards);
        if((dealersum > 21 || playerSum >= dealersum) && playerSum <= 21 && !isNaN(playerSum))
            winners.push(player.name);
    }

    res.status(200).send({winners: winners, table: table});
})


module.exports = router;
