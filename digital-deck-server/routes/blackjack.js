const router = require('express').Router();
const { getSession } = require('../services/utilities');

function addCard(deck, destination)
{
    var randomCard = deck[Math.floor(Math.random() * deck.length)]
    var index = deck.indexOf(randomCard)
    deck.splice(index, 1)
    destination.addCardTop(randomCard) 
}

function value(card)
{
    return card % 13 > 10 ? 10 : card % 13;
}

function sumOfCards(cards)
{
    var sum = 0
    for(var i = 0; i < cards.length; i++)
        sum += value(cards[i])
    return sum
}

router.post('/init', async function (req, res) {
    var sessionId = req.body.sessionId;

    if (isNaN(sessionId)) {
        res.status(400).send("Invalid call. Needs sessionId as a number in the query.");
        return;
    }

    var session = getSession(sessionId);
    if (!session) {
      res.status(400).send("Invalid request. Could not find session with Id " + sessionId);
      return;
    }

    var table = session.table;
    var deck = session.deck;
    table.cards = [] // make sure the array is empty first
    addCard(deck, table)
    addCard(deck, table)
    table.cards[0] = -1 * table.cards[0] // flip one card

    var players = session.players;
    for(var i = 0; i < players.length; i++)
    {
        players[i].cards = []
        addCard(deck, players[i])
        addCard(deck, players[i])
    }

    res.status(200).send(session);
})


router.post('/dealer', async function (req, res) {
    var sessionId = req.body.sessionId;

    if (isNaN(sessionId)) {
        res.status(400).send("Invalid call. Needs sessionId as a number in the query.");
        return;
    }

    var session = getSession(sessionId);
    if (!session) {
      res.status(400).send("Invalid request. Could not find session with Id " + sessionId);
      return;
    }

    var table = session.table;
    var deck = session.deck;
    table.cards[0] = -1 * table.cards[0] 

    var dealersum = sumOfCards(table.cards)
    while(dealersum <= 16)
    {
        var randomCard = deck[Math.floor(Math.random() * deck.length)]
        var index = deck.indexOf(randomCard)
        deck.splice(index, 1)
        table.addCardTop(randomCard) 
        dealersum += value(randomCard)
    }

    var players = session.players
    var winners = []
    for(var i = 0; i < players.length; i++)
    {
        var playerSum = sumOfCards(players[i].cards)
        if(playerSum > dealersum)
            winners.push(players[i].name)
    }

    res.status(200).send({winners: winners, table: table});
})


module.exports = router;
