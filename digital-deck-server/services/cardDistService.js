var Player = require("../services/player.js");
var Table = require("../services/table.js");

module.exports = {
  distCards: function (decks, players, cardsPerPlayer, cardsOnTable) {
    playerObjs = [];
    table = new Table([]);

    cards = getCards(decks);

    if (players * cardsPerPlayer <= 52 * decks - cardsOnTable) {
      for (var i = 0; i < players; i++) {
        currPlayer = new Player([]);
        for (var j = 0; j < cardsPerPlayer; j++) {
          card = cards.pop();
          currPlayer.addCardTop(card);
        }
        playerObjs.push(currPlayer);
      }

      for (var k = 0; k < cardsOnTable; k++) {
        card = cards.pop();
        table.addCardTop(card);
      }
    } else {
      throw new Error(
        `Cannot distribute ${cardsPerPlayer} cards to each player`
      );
    }
    return { players: playerObjs, table: table, deck: cards };
  },
};

function getCards(decks) {
  cards = [];
  for (var j = 0; j < decks; j++) {
    for (var i = 1; i <= 52; i++) {
      cards.push(i);
    }
  }
  return cards;
}
