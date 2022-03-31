var cardDistService = require('../services/cardDistService');
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
    this.players =[] ;
    this.table ;
    this.deck=[];
    this.cardsPerPlayer = cardsPerPlayer;
    this.cardsOnTable= cardsOnTable;
    Player.resetPlayerCount();
    let newPlayer = new Player([], "");
    this.players.push(newPlayer);
  }
  // updates Deck when shuffleCard Service is called
  updateDeck(newDeck) {
    this.deck = newDeck;
  }
};
