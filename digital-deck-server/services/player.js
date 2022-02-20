module.exports = class Player {
  // keep track of distint players
  static players = 0;
  constructor(cards) {
    this.cards = cards;
    this.playerId = Player.players++;
  }

  static resetPlayerCount() {
    Player.players = 0;
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

  addCard(card, index) {
    // Add card to bottom which is at index 0 (stack)
    this.cards.splice(1, 0, card);
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

  removeCard(index) {
    // Remove a card from the stack
    if (this.cards.length > 0) {
      this.cards.splice(index, 1);
    }
  }
};
