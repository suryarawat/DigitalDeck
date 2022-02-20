var cardDistService = require("./cardDistService.js");
var Player = require("./player.js");
module.exports = class Session {
  static id = 0;
  constructor(decks, players, cardsPerPlayer, cardsOnTable) {
    this.numDecks = decks;
    this.numPlayers = players;
    this.sessionId = Session.id++;
    Player.resetPlayerCount();
    let assignments = cardDistService.distCards(
      decks,
      players,
      cardsPerPlayer,
      cardsOnTable
    );
    this.players = assignments.players;
    this.table = assignments.table;
    this.deck = assignments.deck;
  }
};
