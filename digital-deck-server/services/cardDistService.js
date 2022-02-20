var Player = require("../services/player.js");
var Table = require("../services/table.js");

module.exports = {
  /**
   * Distributes the cards to the players based on the params.
   *
   * @param decks The number of decks to be used in the game session.
   * @param players The number of players in a session.
   * @param cardsPerPlayer The number of cards to give per player.
   * @param cardsOnTable The number of cards to put on the table.
   * @return {json} The json object containing players with player ids and cards assigned to them, table and cards of table and remaining cards on the deck.
   */
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

/**
   * Temporary method to create stub cards deck
   *
   * @param decks The number of decks to be used in the game session.
   * @return {Array} Array containg cards based on how many deck, currently no shuffling here.
   */
  // TODO: This needs to be modified for shuffled cards.
function getCards(decks) {
  cards = [];
  for (var j = 0; j < decks; j++) {
    for (var i = 1; i <= 52; i++) {
      cards.push(i);
    }
  }
  return cards;
}
