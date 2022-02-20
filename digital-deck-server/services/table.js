/**
 * Class for table data and communications.
 */
module.exports = class Table {
  constructor(cards) {
    this.cards = cards;
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
   * add a card to bottom of this tables stack
   *
   * @param card the card to be added
   */
  addCardBottom(card) {
    this.cards.splice(0, 0, card);
  }

  /**
   * add a card to top of this tables stack
   *
   * @param card the card to be added
   */
  addCardTop(card) {
    this.cards.push(card);
  }

  /**
   * remove a card from bottom of this tables stack
   */
  removeCardBottom() {
    if (this.cards.length > 0) {
      this.cards.splice(0, 1);
    }
  }

  /**
   * remove a card from top of this tables stack
   */
  removeCardTop() {
    if (this.cards.length > 0) {
      this.cards.splice(this.cards.length - 1, 1);
    }
  }
};
