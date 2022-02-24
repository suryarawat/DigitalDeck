module.exports = {
    /**
     * Shuffles the cards in the deck
     * 
     * @param cards The deck of cards to be drawn from
     * @return {json} The json containing the ids cards currently in the player's hand and the current deck
     */
    ShuffleCards: function(cards) {
      if (cards.length>1) {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = cards[i];
            cards[i] = cards[j];
            cards[j] = temp;
          }
      } else {
        throw new Error(
          `Not enough cards. Cannot Shuffle deck as it has ${cards.length} cards left.`
        );
      }      
      return { cards: cards };
    }
  }