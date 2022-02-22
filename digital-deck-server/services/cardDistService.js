var Player = require("../services/player.js");
var Table = require("../services/table.js");

module.exports = {
  /**
   * Distributes the cards to the players based on the params.
   *
   * @param decks The number of decks to be used in the game session.
   * @param cardsPerPlayer The number of cards to give per player.
   * @param cardsOnTable The number of cards to put on the table.
   * @return {json} The json object containing players with player ids and cards assigned to them, table and cards of table and remaining cards on the deck.
   */
  distCards: function (decks, cardsPerPlayer, cardsOnTable) {
    let playerObjs = [];
    let table = new Table([]);

    let cards = getCards(decks);

    if (cardsPerPlayer <= 52 * decks - cardsOnTable) {
      let currPlayer = new Player([]);
      for (var j = 0; j < cardsPerPlayer; j++) {
        let card = cards.pop();
        currPlayer.addCardTop(card);
      }
      playerObjs.push(currPlayer);

      for (var k = 0; k < cardsOnTable; k++) {
        let card = cards.pop();
        table.addCardTop(card);
      }
    } else {
      throw new Error(
        `Cannot distribute ${cardsPerPlayer} cards to the player.`
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
  let cards = [];
  for (var j = 0; j < decks; j++) {
    for (var i = 1; i <= 52; i++) {
      cards.push(i);
    }
  }
  return cards;
}
