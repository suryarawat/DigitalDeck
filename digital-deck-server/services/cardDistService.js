var Player = require('../models/player');
var Table = require('../models/table');
var cardShuffleService = require("./cardShuffleService.js");


module.exports = {
  /**
   * Distributes the cards to the players based on the params.
   *
   * @param decks The number of decks to be used in the game session.
   * @param cardsPerPlayer The number of cards to give per player.
   * @param cardsOnTable The number of cards to put on the table.
   * @return {json} The json object containing players with player ids and cards assigned to them, table and cards of table and remaining cards on the deck.
   */
  distCards: function (decks, players, cardsPerPlayer, cardsOnTable) {
    let playerObjs = [];
    let table = new Table([]);

    let cards = getCards(decks);

    if (cardsPerPlayer * players <= 52 * decks - cardsOnTable) {
      for (var i = 0; i < players; i++) {
        let currPlayer = new Player([], "player" + i);
        for (var j = 0; j < cardsPerPlayer; j++) {
          let card = cards.pop();
          currPlayer.addCardTop(card);
        }
        playerObjs.push(currPlayer);
      }

      for (var k = 0; k < cardsOnTable; k++) {
        let card = cards.pop();
        table.addCardTop(card);
      }
    } else {
      throw new Error(
        `Not enough cards, Cannot distribute ${cardsPerPlayer} cards each to ${players} players and ${cardsOnTable} on the table.`
      );
    }
    return { players: playerObjs, table: table, deck: cards };
  },
};

/**
 * Temporary method to create stub cards deck & Shuffling them
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
 return cardShuffleService.shuffleCards(cards);
}
