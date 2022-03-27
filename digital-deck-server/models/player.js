/**
 * Class for player data and communications.
 */
 module.exports = class Player {
    // keep track of distinct players
    static players = 0;
    constructor(cards, name) {
      this.cards = cards;
      this.playerId = Player.players++;
      this.name = name;
    }
  
    /**
     * Resets the ids.
     * */
    static resetPlayerCount() {
      Player.players = 0;
    }
  
    /**
     * Replace current cards with a new Array of cards
     *
     * @param cards The new cards array to replace the older one.
     */
    updateCards(cards) {
      this.cards = cards;
    }
  
    /**
     * add a card to bottom of this players stack
     *
     * @param card the card to be added
     */
    addCardBottom(card) {
      this.cards.splice(0, 0, card);
    }
  
    /**
     * add a card to top of this players stack
     *
     * @param card the card to be added
     */
    addCardTop(card) {
      this.cards.push(card);
    }
  
    /**
     * add a card to desired position of this players stack
     *
     * @param card the card to be added
     */
    addCard(card, index) {
      this.cards.splice(1, 0, card);
    }
  
    /**
     * remove a card from bottom of this players stack
     */
    removeCardBottom() {
      let bottomCard = this.cards[0];
      if (this.cards.length > 0) {
        this.cards.splice(0, 1);
      }
      return bottomCard;
    }
  
    /**
     * remove a card from top of this players stack
     */
    removeCardTop() {
      let topCard = this.cards[this.cards.length - 1];
      if (this.cards.length > 0) {
        this.cards.splice(this.cards.length - 1, 1);
      }
      return topCard;
    }
  
    /**
     * remove a card from given index of this players stack
     *
     * @param index The index of the card to remove
     */
    removeCard(index) {
      let cardToRemove = this.cards[index];
      if (this.cards.length > 0) {
        this.cards.splice(index, 1);
      }
      return cardToRemove;
    }

    setName(name)
    {
      this.name = name;
    }
  };
  