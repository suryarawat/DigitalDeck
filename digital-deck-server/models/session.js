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

    //add First PLayer when a new session is created.. empty cards 
    let newPlayer = new Player([], "");
    this.players.push(newPlayer);
    // new player ids
    // initial card distribution
    // let assignments = cardDistService.distCards(
    //   decks,
    //   players,
    //   cardsPerPlayer,
    //   cardsOnTable
    // );

    // this.players = assignments.players;
    // this.table = assignments.table;
    // this.deck = assignments.deck;
  }
  // updates Deck when shuffleCard Service is called
  updateDeck(newDeck) {
    this.deck = newDeck;
  }
};
