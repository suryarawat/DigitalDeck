module.exports = {
  /**
   * Draws cards from the deck and assign them to the player
   * 
   * @param deck The deck of cards to be drawn from
   * @param numOfCards The number of cards to be drawn
   * @param player The player drawing cards
   * @return {json} The json containing the ids cards currently in the player's hand and the current deck
   */
  drawCards: function(deck, numOfCards, player) {
    if (numOfCards <= deck.length) {
      for (var i = 0; i < numOfCards; i++) {
        let currCard = deck.pop();
        player.addCardTop(currCard);
      }
    } else {
      throw new Error(
        `Not enough cards. Cannot draw ${numOfCards} cards with the deck only having ${deck.length} cards left.`
      );
    }

    return { cards: player.cards, deck: deck };
  }
}