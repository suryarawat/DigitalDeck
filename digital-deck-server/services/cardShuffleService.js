module.exports = {
    /**
     * Shuffles the cards in the deck
     * 
     * @param cards The deck of cards to be drawn from
     * @return {Array} The json containing the ids cards currently in the player's hand and the current deck
     */
    shuffleCards: function(cards) {
      let shuffledCards = cards.slice();
      if (shuffledCards.length>1) {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = shuffledCards[i];
            shuffledCards[i] = shuffledCards[j];
            shuffledCards[j] = temp;
          }
      } else {
        throw new Error(
          `Not enough cards. Cannot Shuffle deck as it has ${cards.length} cards left.`
        );
      }      
      return shuffledCards;
    }
  }