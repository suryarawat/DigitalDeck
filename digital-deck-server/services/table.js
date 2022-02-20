module.exports = class Table {
  constructor(cards) {
    this.cards = cards;
  }

  updateCards(cards) {
    // Update the whole deck of cards
    this.cards = cards;
  }

  addCardBottom(card) {
    // Add card to bottom which is at index 0 (stack)
    this.cards.splice(0, 0, card);
  }

  addCardTop(card) {
    // Add card to top of the stack
    this.cards.push(card);
  }

  removeCardBottom() {
    // Remove a card from bottom of stack
    if (this.cards.length > 0) {
      this.cards.splice(0, 1);
    }
  }

  removeCardTop() {
    // Remove a card from the top of stack
    if (this.cards.length > 0) {
      this.cards.splice(this.cards.length - 1, 1);
    }
  }
};
