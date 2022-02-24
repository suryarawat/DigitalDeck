var cardDistService = require("./cardDistService.js");
var cardDrawService = require("./cardDrawService.js");
var Player = require("./player.js");

/**
 * Class that creates and manages a game session
 */
module.exports = class Session {
  // Keeps track of distinct game sessions
  static id = 0;
  constructor(decks, players, cardsPerPlayer, cardsOnTable) {
    this.numDecks = decks;
    this.numPlayers = players;
    this.sessionId = Session.id++;

    // new player ids
    Player.resetPlayerCount();
    // initial card distribution
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

  drawCards(playerId, numOfCards) {
    let player = this.players.find(p => p.playerId === playerId);
    return cardDrawService.drawCards(this.deck, numOfCards, player);
  }
};